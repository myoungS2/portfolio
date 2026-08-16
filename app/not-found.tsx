import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="section"
      style={{
        minHeight: "60svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <p className="label">404 — NOT FOUND</p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "clamp(40px, 9vw, 110px)",
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
        }}
      >
        PAGE NOT FOUND
      </h1>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: "var(--fg-sub)",
          maxWidth: "44ch",
        }}
      >
        요청하신 페이지가 없습니다. 주소를 확인하시거나 아래에서 이동해 주세요.
      </p>
      <div style={{ display: "flex", gap: 28, marginTop: 8, fontSize: 13, fontWeight: 600 }}>
        <Link href="/">← HOME</Link>
        <Link href="/#works">WORKS →</Link>
      </div>
    </div>
  );
}
