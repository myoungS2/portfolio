import { Fragment } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import HeroCharm from "@/components/HeroCharm";
import Reveal from "@/components/Reveal";
import TypedText from "@/components/TypedText";
import { capabilities, site, stacks } from "@/data/site";
import { works, type CharmKey } from "@/data/works";
import daisy from "@/assets/charms/daisy.webp";
import flamingo from "@/assets/charms/flamingo.webp";
import shield from "@/assets/charms/shield.webp";
import truck from "@/assets/charms/truck.webp";
import styles from "./page.module.css";

/** WORKS 카드의 시각 슬롯 — 히어로 키링에 달린 charm과 같은 이미지 */
const charmImages: Record<CharmKey, StaticImageData> = {
  shield,
  truck,
  daisy,
  flamingo,
};

export default function Home() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section id="top" className={styles.hero}>
        <h1 className={styles.title}>
          {site.nameEn}
          <span className={styles.dot}>.</span>
        </h1>

        <div className={styles.stage}>
          <p className={styles.capLeft}>{site.roleEn}</p>
          <div className={styles.charm}>
            <HeroCharm />
          </div>
          <p className={styles.capRight}>
            {site.nameEn} {site.year}
          </p>
        </div>

        <div className={styles.scroll}>
          <span>SCROLL DOWN</span>
          <span className={styles.arrow} aria-hidden="true">
            ↓
          </span>
        </div>
      </section>

      {/* ---------------- 01 ABOUT ---------------- */}
      <Reveal as="section" id="about" className="section split">
        <p className="label">01 — ABOUT</p>
        <div>
          <h2 className={styles.aboutHeading}>
            {site.aboutHeading.before}{" "}
            <TypedText text={site.aboutHeading.typed} className={styles.mono} />
            {site.aboutHeading.after}
          </h2>

          <div className={styles.aboutBody}>
            {site.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ---------------- 02 WORKS ---------------- */}
      <Reveal as="section" id="works" className={`section ${styles.bordered}`}>
        <div className={styles.worksHead}>
          <p className="label">02 — WORKS</p>
          <p className={styles.worksNote}>
            키링에 달린 charm 하나가 이야기 하나입니다
          </p>
        </div>

        <div className={styles.worksList}>
          {works.map((w, i) => (
            <article key={w.slug} className={styles.work}>
              <div className={styles.visual}>
                <Image
                  className={styles.visualCharm}
                  src={charmImages[w.charm]}
                  alt=""
                  width={150}
                  height={150}
                  quality={90}
                />
              </div>

              <div>
                <p className={styles.workNo}>
                  WORK {String(i + 1).padStart(2, "0")}
                  {w.ongoing && <span className={styles.ongoing}>ONGOING</span>}
                </p>
                <h3 className={styles.workTitle}>
                  <Link href={`/works/${w.slug}`}>{w.title}</Link>
                </h3>
                <p className={styles.workMeta}>
                  {w.period} — {w.category}
                </p>
                <p className={styles.workDesc}>{w.summary}</p>
                {/* 'Spring Boot' 'Google Cloud Run'처럼 공백이 든 이름이
                    줄 끝에서 쪼개지지 않도록 항목마다 nowrap을 겁니다 */}
                <p className={styles.workStack}>
                  {w.stack.map((s, si) => (
                    <Fragment key={s}>
                      {si > 0 && " · "}
                      <span className={styles.nowrap}>{s}</span>
                    </Fragment>
                  ))}
                </p>
                <Link href={`/works/${w.slug}`} className={styles.workLink}>
                  자세히 보기 <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      {/* ---------------- 03 SKILLS ---------------- */}
      <Reveal
        as="section"
        id="skills"
        className={`section split ${styles.bordered}`}
      >
        <p className="label">03 — SKILLS</p>
        <div>
          <div className={styles.stackList}>
            {stacks.map((s) => (
              <div key={s.label} className={styles.stackRow}>
                <div className={styles.stackLabel}>{s.label}</div>
                <div className={styles.stackItems}>
                  {s.items.map((item) => (
                    <span key={item} className={styles.stackTag}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3 className={styles.subLabel}>WHAT I CAN DO</h3>
          <div className={styles.capGrid}>
            {capabilities.map((c) => (
              <div key={c.title} className={styles.capItem}>
                <h4 className={styles.capTitle}>{c.title}</h4>
                <p className={styles.capBody}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </>
  );
}
