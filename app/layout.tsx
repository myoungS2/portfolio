import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/data/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const description = `Java 백엔드 개발자 ${site.name}의 포트폴리오. 시스템 구조 설계, 레거시 리팩토링, 배포·형상 관리, AI 개발 워크플로우.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description,
  keywords: [
    "심미영",
    "백엔드 개발자",
    "포트폴리오",
    "Java",
    "Spring Boot",
    "시스템 설계",
  ],
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: site.url,
    siteName: `${site.nameEn} Portfolio`,
    title: `${site.name} · ${site.role}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.role}`,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={spaceGrotesk.variable}>
      <head>
        {/* Pretendard는 Google Fonts에 없어 배포판 CDN을 씁니다 (디자인 사양) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />

        {/* Cloudflare Web Analytics — 쿠키·IP 없이 방문/유입경로만 집계 */}
        {site.cfAnalyticsToken && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: site.cfAnalyticsToken })}
          />
        )}
      </body>
    </html>
  );
}
