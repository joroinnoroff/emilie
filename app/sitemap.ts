import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"
import { getWorks } from "@/sanity/lib/fetch"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const works = await getWorks()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ]

  const workRoutes: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${siteUrl}/shop/${work.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...workRoutes]
}
