"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** 지연(ms) — 같은 그룹을 순차로 나타낼 때 */
  delay?: number;
  as?: ElementType;
  className?: string;
  id?: string;
};

/**
 * 뷰포트에 들어오면 한 번만 나타나는 래퍼.
 * 실제 트랜지션은 globals.css의 [data-reveal] 규칙이 담당합니다.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 이미 화면 안에 있으면 관찰 없이 즉시 표시
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
