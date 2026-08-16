import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { getAdjacent, getWork, works } from "@/data/works";
import daisy from "@/assets/charms/daisy.webp";
import flamingo from "@/assets/charms/flamingo.webp";
import shield from "@/assets/charms/shield.webp";
import truck from "@/assets/charms/truck.webp";
import styles from "./page.module.css";

const charmImages = { shield, truck, daisy, flamingo };

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return { title: "Not Found" };

  return {
    title: work.title,
    description: work.summary,
    openGraph: {
      title: work.title,
      description: work.summary,
      type: "article",
    },
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const index = works.findIndex((w) => w.slug === slug);
  const { prev, next } = getAdjacent(slug);

  return (
    <article className={styles.page}>
      <Link href="/#works" className={styles.back}>
        <span aria-hidden="true">←</span> WORKS
      </Link>

      <header className={styles.head}>
        <p className={styles.no}>
          {String(index + 1).padStart(2, "0")} — {work.category}
        </p>
        <div>
          <h1 className={styles.title}>
            {work.title}
            {work.ongoing && <span className={styles.badge}>ONGOING</span>}
          </h1>
          <p className={styles.subtitle}>{work.subtitle}</p>
        </div>
        <Image
          className={styles.charm}
          src={charmImages[work.charm]}
          alt=""
          width={132}
          height={132}
          quality={90}
          priority
        />
      </header>

      <dl className={styles.meta}>
        <div>
          <dt className={styles.metaKey}>PERIOD</dt>
          <dd className={styles.metaVal}>{work.period}</dd>
        </div>
        <div>
          <dt className={styles.metaKey}>ORGANIZATION</dt>
          <dd className={styles.metaVal}>{work.org}</dd>
        </div>
        <div>
          <dt className={styles.metaKey}>ROLE</dt>
          <dd className={styles.metaVal}>{work.role}</dd>
        </div>
        <div>
          <dt className={styles.metaKey}>STACK</dt>
          <dd className={styles.tags}>
            {work.stack.map((s) => (
              <span key={s} className={styles.tag}>
                {s}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <p className={styles.summary}>{work.summary}</p>

      <div className={styles.chapters}>
        {work.chapters.map((chapter, ci) => (
          <Reveal key={chapter.title} as="section" className={styles.chapter}>
            <header className={styles.chapterHead}>
              <span className={styles.chapterNo}>
                {String(ci + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className={styles.chapterTitle}>{chapter.title}</h2>
                <p className={styles.chapterPeriod}>{chapter.period}</p>
              </div>
            </header>

            <div className={styles.blocks}>
              {chapter.blocks.map((block) => (
                <div key={block.label} className={styles.block}>
                  <h3 className={styles.blockLabel}>{block.label}</h3>
                  <ul className={styles.blockList}>
                    {block.items.map((item, i) => (
                      <li key={i} className={styles.blockItem}>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <nav className={styles.pager} aria-label="다른 작업">
        {prev && (
          <Link href={`/works/${prev.slug}`} className={styles.pagerItem}>
            <span className={styles.pagerDir}>← PREVIOUS</span>
            <span className={styles.pagerTitle}>{prev.title}</span>
          </Link>
        )}
        {next && (
          <Link
            href={`/works/${next.slug}`}
            className={`${styles.pagerItem} ${styles.pagerNext}`}
          >
            <span className={styles.pagerDir}>NEXT →</span>
            <span className={styles.pagerTitle}>{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
