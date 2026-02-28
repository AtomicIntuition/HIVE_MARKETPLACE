import { MetadataRoute } from "next";
import { SITE_CONFIG, CATEGORIES } from "@/lib/constants";
import { getAllTools } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getAllTools();

  const toolPages = tools.map((tool) => ({
    url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
    lastModified: new Date(tool.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${SITE_CONFIG.url}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...toolPages,
    ...categoryPages,
  ];
}
