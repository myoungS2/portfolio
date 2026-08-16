import type { MetadataRoute } from "next";
import { works } from "@/data/works";
import { site } from "@/data/site";

/* output: "export"에서는 metadata route도 정적으로 굽는다고 명시해야 합니다 */
export const dynamic = "force-static";


export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: site.url, lastModified: now, priority: 1 },
    ...works.map((w) => ({
      url: `${site.url}/works/${w.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
