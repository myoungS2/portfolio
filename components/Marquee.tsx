"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Marquee.module.css";

type Props = {
  items: readonly string[];
  /** 한 바퀴 도는 데 걸리는 시간(초) */
  duration?: number;
  gap?: number;
  /** 타이포 변형: "skills" | "wordmark" */
  variant?: "skills" | "wordmark";
  /** 이 문자열과 일치하는 항목은 액센트 컬러로 */
  accent?: string;
  /** 스크린리더용 대체 문구. 없으면 장식으로 간주합니다 */
  label?: string;
};

/**
 * 무한 흐름 티커. 콘텐츠를 2회 복제한 뒤 -50%까지 이동시킵니다.
 * 화면 밖에서는 애니메이션을 멈춰 불필요한 합성 작업을 줄입니다.
 */
export default function Marquee({
  items,
  duration = 24,
  gap = 48,
  variant = "skills",
  accent,
  label,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) =>
      setRunning(entry.isIntersecting),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 복제본까지 한 배열로 펼쳐 하나의 트랙에 넣습니다
  const doubled = [...items, ...items];

  return (
    <div
      ref={ref}
      className={styles.viewport}
      data-running={running}
      style={
        {
          "--duration": `${duration}s`,
          "--gap": `${gap}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={`${styles.track} ${styles[variant]}`}
        aria-hidden="true"
      >
        {doubled.map((item, i) => (
          <span key={i} className={item === accent ? styles.accent : undefined}>
            {item}
          </span>
        ))}
      </div>
      {label && <span className={styles.srOnly}>{label}</span>}
    </div>
  );
}
