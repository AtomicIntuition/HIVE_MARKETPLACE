import { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

export function createMetadata({
  title,
  description,
  path = "",
  ogImage,
}: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} — The Marketplace for AI Agent Tools`;
  const desc = description || SITE_CONFIG.description;
  const url = `${SITE_CONFIG.url}${path}`;
  const image = ogImage || SITE_CONFIG.ogImage;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_CONFIG.name,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [image],
      creator: SITE_CONFIG.creator,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
