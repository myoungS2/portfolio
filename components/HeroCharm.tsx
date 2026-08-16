import Image from "next/image";
import clasp from "@/assets/charms/clasp.webp";
import daisy from "@/assets/charms/daisy.webp";
import flamingo from "@/assets/charms/flamingo.webp";
import ring from "@/assets/charms/ring.webp";
import shield from "@/assets/charms/shield.webp";
import truck from "@/assets/charms/truck.webp";
import styles from "./HeroCharm.module.css";

/**
 * 히어로 중앙의 키링 — 디자인 핸드오프(design_handoff_portfolio) 최종본.
 * 340×490 좌표계, 인라인 스타일 값을 그대로 옮겼습니다.
 *
 *   클래스프(w100) → 링(w82, scaleY 0.62로 눕혀 원근) → 링 위 서로 다른
 *   지점에 걸린 스윙 그룹 4개. 각 그룹은 고리(CSS 타원) + 참 이미지.
 *
 *   A 데이지   w112 — 비앤비퓨너럴서비스
 *   B 트럭     w124 — 경동택배 · 합동물류
 *   C 플라밍고 w88  — Plan&Go
 *   D 방패     w104 — 비젠트로
 *
 * 참을 잇는 고리는 이미지가 아니라 CSS 타원(border + inset 하이라이트)입니다.
 * 그룹마다 margin-left가 달라 회전축이 링 위에 퍼지고, 그게 부챗살이 됩니다.
 * 장식이므로 aria-hidden 처리하고, 같은 정보는 WORKS·CAREER 섹션에서
 * 텍스트로 제공합니다.
 */
export default function HeroCharm() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.stage}>
        <Image
          className={styles.clasp}
          src={clasp}
          alt=""
          width={100}
          height={198}
          quality={90}
          priority
        />

        {/* A · 데이지 */}
        <div className={`${styles.group} ${styles.groupA}`}>
          <span className={styles.link} />
          <Image
            className={styles.charm}
            src={daisy}
            alt=""
            width={112}
            height={126}
            quality={90}
            priority
          />
        </div>

        {/* B · 트럭 */}
        <div className={`${styles.group} ${styles.groupB}`}>
          <span className={styles.link} />
          <Image
            className={styles.charm}
            src={truck}
            alt=""
            width={124}
            height={82}
            quality={90}
            priority
          />
        </div>

        {/* C · 플라밍고 */}
        <div className={`${styles.group} ${styles.groupC}`}>
          <span className={styles.link} />
          <Image
            className={styles.charm}
            src={flamingo}
            alt=""
            width={88}
            height={154}
            quality={90}
            priority
          />
        </div>

        {/* D · 방패 */}
        <div className={`${styles.group} ${styles.groupD}`}>
          <span className={styles.link} />
          <Image
            className={styles.charm}
            src={shield}
            alt=""
            width={104}
            height={144}
            quality={90}
            priority
          />
        </div>

        {/* 링은 z-index 0으로 참들 뒤에 깔립니다 */}
        <Image
          className={styles.ring}
          src={ring}
          alt=""
          width={82}
          height={82}
          quality={90}
          priority
        />
      </div>
    </div>
  );
}
