import { site } from "@/data/site";
import MailLink from "./MailLink";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.inner}>
        <p className={styles.label}>04 — CONTACT</p>
        <MailLink className={styles.email} />

        <div className={styles.links}>
          {/* 색은 .links a 선택자가 담당하므로 클래스를 주지 않습니다 */}
          <MailLink label="EMAIL" />
          <a href={site.github} target="_blank" rel="noreferrer noopener">
            GITHUB
          </a>
        </div>

        <div className={styles.bottom}>
          <span>
            © {site.year} {site.nameEn}
          </span>
        </div>
      </div>
    </footer>
  );
}
