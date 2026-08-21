"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import Matter from "matter-js";
import chain from "@/assets/charms/chain.webp";
import clasp from "@/assets/charms/clasp.webp";
import daisy from "@/assets/charms/daisy.webp";
import flamingo from "@/assets/charms/flamingo.webp";
import shield from "@/assets/charms/shield.webp";
import truck from "@/assets/charms/truck.webp";
import styles from "./HeroCharm.module.css";

/**
 * 히어로 중앙의 키링 — Matter.js 물리 시뮬레이션.
 * 340×490 좌표계이며, 이 좌표가 그대로 물리 좌표계입니다.
 *
 *   클래스프(CSS로 w78, x=171) → 그 아래 서로 다른 지점에 걸린 체인 4줄.
 *   각 줄은 체인 세그먼트(다관절 진자) + 끝에 매달린 참.
 *
 *   A 데이지   w122 — 비앤비퓨너럴서비스
 *   B 트럭     w134 — 경동택배 · 합동물류
 *   C 플라밍고 w97  — Plan&Go
 *   D 방패     w111 — 비젠트로
 *
 * 이전 버전은 CSS 키프레임으로 고정 각도를 왕복시켰지만, 지금은 실제
 * 진자 물리를 풉니다. 체인은 세그먼트 몸체 위치가 아니라 '관절점 사이'를
 * 이어 그려서, 관절이 벌어져도 끊겨 보이지 않습니다.
 *
 * 참끼리는 원형 히트박스로 부딪히고(각진 박스는 이웃에 쐐기처럼 끼입니다),
 * 수직 복원 토크로 눕지 않으며, 약한 복원 스프링이 부챗살 배치를 지켜
 * 드래그로 엉키거나 바람에 자리가 뒤바뀌어도 스스로 제자리로 돌아옵니다.
 *
 * 서버 렌더 결과에는 물리 시작 포즈를 인라인 transform으로 넣어, 스크립트가
 * 실행되기 전에도 부챗살이 그려집니다(첫 페인트 깜빡임 방지).
 *
 * 장식이므로 aria-hidden 처리하고, 같은 정보는 WORKS·CAREER 섹션에서
 * 텍스트로 제공합니다. prefers-reduced-motion이면 물리 없이 이 포즈로 멈춥니다.
 */

const STAGE_W = 340;
const STAGE_H = 490;

type Charm = {
  name: string;
  src: StaticImageData;
  /** 렌더 크기 */
  w: number;
  h: number;
  /** 이미지 좌상단 기준, 체인이 걸리는 구멍 좌표 (알파 실측) */
  hole: { x: number; y: number };
  /** 체인이 걸리는 지점 (스테이지 좌표) */
  pivot: { x: number; y: number };
  chainLen: number;
  chainW: number;
  /** chain 이미지 한 장이 차지하는 높이 — 이 간격으로 세로 반복 */
  chainTile: number;
  /** 시작 각도(°, 양수 = 왼쪽으로 벌어짐) */
  angle: number;
  z: number;
};

const CHARMS: Charm[] = [
  { name: "daisy",    src: daisy,    w: 122, h: 136, hole: { x: 60.6, y: 5.3 }, pivot: { x: 156, y: 168 }, chainLen: 100, chainW: 17, chainTile: 100, angle: 55.5, z: 1 },
  { name: "truck",    src: truck,    w: 134, h: 114, hole: { x: 47.7, y: 6.3 }, pivot: { x: 160, y: 174 }, chainLen:  64, chainW: 16, chainTile:  64, angle: 10,   z: 3 },
  { name: "flamingo", src: flamingo, w:  97, h: 176, hole: { x: 35.5, y: 9.2 }, pivot: { x: 180, y: 175 }, chainLen: 118, chainW: 16, chainTile:  59, angle: -6,   z: 4 },
  { name: "shield",   src: shield,   w: 111, h: 147, hole: { x: 50.2, y: 7.5 }, pivot: { x: 185, y: 170 }, chainLen: 100, chainW: 17, chainTile: 100, angle: -43.5, z: 2 },
];

/** 체인 물리 세그먼트 길이 — 짧을수록 더 낭창낭창합니다 */
const SEG_LEN = 26;
/** 참이 수직으로 서려는 토크 */
const UPRIGHT_K = 0.00005;
/** 시작 포즈로 당기는 복원 스프링 — 엉킴을 풀고 부챗살 순서를 지킵니다 */
const HOME_STIFFNESS = 0.0009;
/** 간헐적 돌풍 / 상시 흔들림 */
const GUST_STRENGTH = 0.0016;
const SWAY_STRENGTH = 0.00028;

const segCountOf = (c: Charm) => Math.max(2, Math.round(c.chainLen / SEG_LEN));
const holeOffset = (c: Charm) => ({ x: c.hole.x - c.w / 2, y: c.hole.y - c.h / 2 });

/** 시작 포즈 — 물리 초기 상태와 같은 값이라 첫 페인트가 튀지 않습니다 */
function restPose(c: Charm) {
  const rad = (c.angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  // 좌표는 소수 둘째 자리로 끊습니다. 브라우저가 style 속성을 파싱하며 정밀도를
  // 정규화하기 때문에, 긴 부동소수를 그대로 쓰면 하이드레이션 불일치가 납니다.
  const round = (n: number) => Math.round(n * 100) / 100;
  const spin = (x: number, y: number) => {
    const dx = x - c.pivot.x;
    const dy = y - c.pivot.y;
    return {
      x: round(c.pivot.x + dx * cos - dy * sin),
      y: round(c.pivot.y + dx * sin + dy * cos),
    };
  };
  const segCount = segCountOf(c);
  const segH = round(c.chainLen / segCount);
  const hole = holeOffset(c);
  return {
    segs: Array.from({ length: segCount }, (_, i) => spin(c.pivot.x, c.pivot.y + segH * (i + 0.5))),
    charm: spin(c.pivot.x - hole.x, c.pivot.y + c.chainLen - 4 - hole.y),
    segH,
  };
}

export default function HeroCharm() {
  const stageRef = useRef<HTMLDivElement>(null);
  const segRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const charmRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const {
      Engine, Bodies, Body, Composite, Constraint,
      Mouse, MouseConstraint, Events, Vector,
    } = Matter;

    // 체인은 서로 부딪히지 않고, 참은 참끼리와 마우스에만 반응합니다
    const CHAIN_FILTER = { category: 0x0004, mask: 0x0000 };
    const CHARM_FILTER = { category: 0x0002, mask: 0x0003 };

    const engine = Engine.create({ enableSleeping: false });
    engine.positionIterations = 10;
    engine.velocityIterations = 8;
    engine.constraintIterations = 6;

    const groups = CHARMS.map((cfg, index) => {
      const { pivot } = cfg;
      const segCount = segCountOf(cfg);
      const segH = cfg.chainLen / segCount;
      const segBodies: Matter.Body[] = [];
      const constraints: Matter.Constraint[] = [];

      for (let s = 0; s < segCount; s++) {
        const seg = Bodies.rectangle(pivot.x, pivot.y + segH * (s + 0.5), 6, segH, {
          frictionAir: 0.06,
          density: 0.0008,
          collisionFilter: CHAIN_FILTER,
        });
        segBodies.push(seg);
        constraints.push(
          Constraint.create({
            bodyB: seg,
            pointB: { x: 0, y: -segH / 2 },
            ...(s === 0
              ? { pointA: pivot }
              : { bodyA: segBodies[s - 1], pointA: { x: 0, y: segH / 2 } }),
            length: 0,
            stiffness: 1,
            damping: 0.1,
          }),
        );
      }

      const hole = holeOffset(cfg);
      const charm = Bodies.circle(
        pivot.x - hole.x,
        pivot.y + cfg.chainLen - 4 - hole.y,
        Math.min(cfg.w, cfg.h) * 0.42,
        {
          frictionAir: 0.022,
          friction: 0.05,
          density: 0.0014,
          restitution: 0.05,
          collisionFilter: CHARM_FILTER,
        },
      );
      constraints.push(
        Constraint.create({
          bodyA: segBodies[segCount - 1],
          pointA: { x: 0, y: segH / 2 },
          bodyB: charm,
          pointB: hole,
          length: 0,
          stiffness: 1,
          damping: 0.1,
        }),
      );

      const group = Composite.create({ bodies: [...segBodies, charm], constraints });
      Composite.rotate(group, (cfg.angle * Math.PI) / 180, pivot);
      Body.setAngle(charm, 0);

      Composite.add(
        group,
        Constraint.create({
          pointA: { x: charm.position.x, y: charm.position.y + 20 },
          bodyB: charm,
          length: 0,
          stiffness: HOME_STIFFNESS,
          damping: 0.02,
        }),
      );

      Composite.add(engine.world, group);
      return { cfg, index, pivot, hole, segBodies, segH, charm };
    });

    const charmBodies = groups.map((g) => g.charm);

    const onBeforeUpdate = () => {
      const t = engine.timing.timestamp;
      if (t > nextGust) {
        gust = (Math.random() - 0.5) * GUST_STRENGTH;
        gustUntil = t + 600 + Math.random() * 700;
        nextGust = t + 2500 + Math.random() * 4000;
      }
      const wind = t < gustUntil ? gust : 0;
      charmBodies.forEach((b, i) => {
        // 위상차를 작게 둬서 이웃끼리 가위처럼 엇갈리지 않게 합니다
        const sway = Math.sin((t / 1000) * 0.7 + i * 0.6) * SWAY_STRENGTH;
        Body.applyForce(b, b.position, { x: (sway + wind) * b.mass, y: 0 });
        let d = b.angle % (Math.PI * 2);
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        b.torque += -d * UPRIGHT_K * b.inertia;
      });
    };
    let gust = 0;
    let gustUntil = 0;
    let nextGust = 3000;
    Events.on(engine, "beforeUpdate", onBeforeUpdate);

    const at = (body: Matter.Body, local: Matter.Vector) =>
      Vector.add(body.position, Vector.rotate(local, body.angle));

    const draw = () => {
      for (const g of groups) {
        const n = g.segBodies.length;
        // 관절점을 이어 그립니다 — 몸체 위치대로 그리면 관절이 벌어질 때 끊겨 보입니다
        const joints: Matter.Vector[] = [g.pivot];
        for (let s = 1; s < n; s++) {
          const a = at(g.segBodies[s - 1], { x: 0, y: g.segH / 2 });
          const b = at(g.segBodies[s], { x: 0, y: -g.segH / 2 });
          joints.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
        }
        const tail = at(g.segBodies[n - 1], { x: 0, y: g.segH / 2 });
        const head = at(g.charm, g.hole);
        joints.push({ x: (tail.x + head.x) / 2, y: (tail.y + head.y) / 2 });

        for (let s = 0; s < n; s++) {
          const el = segRefs.current[g.index]?.[s];
          if (!el) continue;
          const p = joints[s];
          const q = joints[s + 1];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const dist = Math.max(Math.hypot(dx, dy), 4);
          el.style.transform =
            `translate(${(p.x + q.x) / 2 - g.cfg.chainW / 2}px, ${(p.y + q.y) / 2 - (g.segH + 2) / 2}px)` +
            ` rotate(${Math.atan2(dy, dx) - Math.PI / 2}rad) scaleY(${dist / g.segH})`;
        }

        const charmEl = charmRefs.current[g.index];
        if (charmEl) {
          charmEl.style.transform =
            `translate(${g.charm.position.x - g.cfg.w / 2}px, ${g.charm.position.y - g.cfg.h / 2}px)` +
            ` rotate(${g.charm.angle}rad)`;
        }
      }
    };

    const mouse = Mouse.create(stage);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.15, damping: 0.12 },
    });
    Composite.add(engine.world, mc);
    // 휠은 페이지 스크롤에 양보합니다
    const wheelHandler = (mouse as unknown as { mousewheel: EventListener }).mousewheel;
    (["wheel", "mousewheel", "DOMMouseScroll"] as const).forEach((ev) =>
      stage.removeEventListener(ev, wheelHandler),
    );
    const onStart = () => stage.classList.add(styles.dragging);
    const onEnd = () => stage.classList.remove(styles.dragging);
    Events.on(mc, "startdrag", onStart);
    Events.on(mc, "enddrag", onEnd);

    // 스테이지는 --charm-scale로 축소·확대되므로 포인터 좌표를 물리 좌표로 되돌립니다
    const syncMouseScale = () => {
      const rect = stage.getBoundingClientRect();
      if (rect.width > 0) {
        Mouse.setScale(mouse, { x: STAGE_W / rect.width, y: STAGE_H / rect.height });
      }
    };
    syncMouseScale();
    const ro = new ResizeObserver(syncMouseScale);
    ro.observe(stage);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // matter-js 권장 상한(16.667ms)을 넘기지 않습니다 — 탭 복귀 시 몰아치는 것도 막습니다
      const dt = Math.min(now - last, 16.667);
      last = now;
      Engine.update(engine, dt);
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      Events.off(mc, "startdrag", onStart);
      Events.off(mc, "enddrag", onEnd);
      Events.off(engine, "beforeUpdate", onBeforeUpdate);
      const m = mouse as unknown as Record<string, EventListener>;
      stage.removeEventListener("mousemove", m.mousemove);
      stage.removeEventListener("mousedown", m.mousedown);
      stage.removeEventListener("mouseup", m.mouseup);
      stage.removeEventListener("touchmove", m.mousemove);
      stage.removeEventListener("touchstart", m.mousedown);
      stage.removeEventListener("touchend", m.mouseup);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.stage} ref={stageRef}>
        <Image
          className={styles.clasp}
          src={clasp}
          alt=""
          width={100}
          height={198}
          quality={90}
          priority
        />

        {CHARMS.map((cfg, i) => {
          const pose = restPose(cfg);
          return (
            <div key={cfg.name} className={styles.group} style={{ zIndex: cfg.z }}>
              {pose.segs.map((p, s) => (
                <div
                  key={s}
                  ref={(el) => {
                    (segRefs.current[i] ??= [])[s] = el;
                  }}
                  className={styles.seg}
                  style={{
                    width: cfg.chainW,
                    height: pose.segH + 2,
                    backgroundImage: `url(${chain.src})`,
                    backgroundSize: `${cfg.chainW}px ${cfg.chainTile}px`,
                    backgroundPosition: `0 ${-((pose.segH * s) % cfg.chainTile)}px`,
                    transform: `translate(${p.x - cfg.chainW / 2}px, ${p.y - (pose.segH + 2) / 2}px) rotate(${cfg.angle}deg)`,
                  }}
                />
              ))}
              <div
                ref={(el) => {
                  charmRefs.current[i] = el;
                }}
                className={styles.charm}
                style={{
                  width: cfg.w,
                  height: cfg.h,
                  transform: `translate(${pose.charm.x - cfg.w / 2}px, ${pose.charm.y - cfg.h / 2}px)`,
                }}
              >
                <Image src={cfg.src} alt="" width={cfg.w} height={cfg.h} quality={90} priority />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
