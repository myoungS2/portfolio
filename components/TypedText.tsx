"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  className?: string;
  /** 글자당 지연(ms) */
  speed?: number;
};

/**
 * 뷰포트 진입 시 한 글자씩 타이핑되는 텍스트. 1회만 실행합니다.
 * 모션 축소 설정에서는 즉시 전체를 표시합니다.
 */
export default function TypedText({ text, className, speed = 90 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setCount(text.length);
          return;
        }

        let i = 0;
        timer = setInterval(() => {
          i += 1;
          setCount(i);
          if (i >= text.length && timer) clearInterval(timer);
        }, speed);
      },
      { threshold: 0.15 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [text, speed]);

  return (
    <span ref={ref} className={className}>
      {/* 타이핑 전에도 첫 글자를 노출해 줄바꿈이 흔들리지 않게 합니다 */}
      {text.slice(0, count) || text.slice(0, 1)}
    </span>
  );
}
