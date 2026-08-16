"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";

type Props = {
  className?: string;
  /** 지정하면 주소 대신 이 문구를 보여줍니다 */
  label?: string;
};

/**
 * 메일 주소를 서버 HTML에 통째로 남기지 않기 위해, 마운트 후
 * DOM에 직접 채웁니다(스팸 크롤러 대응). 렌더 결과가 아니라
 * 외부 시스템(DOM)을 갱신하는 것이므로 상태를 두지 않습니다.
 */
export default function MailLink({ className, label }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;

    const address = `${site.emailUser}@${site.emailDomain}`;
    a.href = `mailto:${address}`;
    if (a.dataset.showAddress === "true") a.textContent = address;
  }, []);

  return (
    <a
      ref={ref}
      className={className}
      data-show-address={label ? "false" : "true"}
    >
      {label ?? "이메일 주소 보기"}
    </a>
  );
}
