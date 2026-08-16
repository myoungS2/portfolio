import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Cloudflare Pages에 정적 파일로 배포합니다.
   * 전 페이지가 이미 SSG라 서버 런타임이 필요 없습니다. → out/ 생성
   */
  output: "export",

  /**
   * 정적 호스트가 확장자 없는 경로를 어떻게 해석할지에 기대지 않도록
   * 각 라우트를 디렉터리 + index.html로 굽습니다. (/works/vizentro/)
   */
  trailingSlash: true,

  images: {
    /**
     * 정적 내보내기에서는 Next의 이미지 최적화 서버가 없습니다.
     * 대신 charm 에셋을 미리 WebP로 변환해 두었습니다(829KB → 142KB).
     */
    unoptimized: true,
  },
};

export default nextConfig;
