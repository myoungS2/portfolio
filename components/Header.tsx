import Link from "next/link";
import styles from "./Header.module.css";

/**
 * 원페이지 앵커 내비게이션.
 * 상세 페이지(/works/[slug])에서도 동작하도록 항상 "/" 기준 경로를 씁니다.
 */
const nav = [
  { href: "/", label: "HOME", align: "" },
  { href: "/#about", label: "ABOUT", align: styles.center },
  { href: "/#works", label: "WORKS", align: styles.center },
  { href: "/#skills", label: "SKILLS", align: styles.center },
  { href: "/#contact", label: "CONTACT", align: styles.end },
];

export default function Header() {
  return (
    <nav className={styles.nav} aria-label="주요 메뉴">
      {nav.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`${styles.link} ${item.align}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
