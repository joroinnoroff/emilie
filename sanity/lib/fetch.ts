import { client, hasSanityConfig, urlFor } from "@/sanity/lib/client"
import {
  aboutQuery,
  featuredWorksQuery,
  seriesQuery,
  shopWorksQuery,
  siteSettingsQuery,
  workBySlugQuery,
  worksQuery,
} from "@/sanity/lib/queries"
import {
  AboutContent,
  SiteSettings,
  defaultAbout,
  defaultSiteSettings,
} from "@/lib/sanity-content"
import { PROJECTS, type Project, type Status } from "@/lib/projects"

type SanityWork = {
  _id?: string
  id?: string | null
  title?: string | null
  series?: string | null
  year?: string | null
  image?: unknown
  medium?: string | null
  size?: string | null
  stock?: number | null
  priceNok?: number | null
  priceEur?: number | null
  priceUsd?: number | null
  price?: string | null
  status?: Status | null
  forSale?: boolean | null
  featured?: boolean | null
  description?: string | null
}

function formatDisplayPrice(doc: SanityWork): string {
  if (doc.price) return doc.price
  if (doc.priceEur != null) return `€${doc.priceEur.toLocaleString("nb-NO")}`
  if (doc.priceNok != null) return `${doc.priceNok.toLocaleString("nb-NO")} kr`
  if (doc.priceUsd != null) return `$${doc.priceUsd.toLocaleString("en-US")}`
  return "—"
}

function normalizeWork(doc: SanityWork | null | undefined): Project | null {
  if (!doc?.id || !doc?.title) return null

  let image = ""
  try {
    if (doc.image) image = urlFor(doc.image as Parameters<typeof urlFor>[0]).width(1400).url()
  } catch {
    image = ""
  }

  const status: Status = doc.status === "Sold" ? "Sold" : "Available"
  const stock = typeof doc.stock === "number" ? doc.stock : status === "Sold" ? 0 : 1

  return {
    id: doc.id,
    sanityId: doc._id,
    title: doc.title,
    series: doc.series || "Works",
    year: doc.year || "",
    image,
    medium: doc.medium || "Oil on canvas",
    size: doc.size || "",
    stock,
    priceNok: doc.priceNok ?? undefined,
    priceEur: doc.priceEur ?? undefined,
    priceUsd: doc.priceUsd ?? undefined,
    price: formatDisplayPrice(doc),
    status,
    forSale: Boolean(doc.forSale) && status !== "Sold" && stock > 0,
    description: doc.description || "",
  }
}

function normalizeWorks(docs: SanityWork[] | null | undefined): Project[] {
  return (docs || []).map(normalizeWork).filter((w): w is Project => Boolean(w))
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSanityConfig) return defaultSiteSettings

  try {
    const data = await client.fetch<SiteSettings | null>(
      siteSettingsQuery,
      {},
      { next: { revalidate: 30, tags: ["siteSettings"] } }
    )
    return { ...defaultSiteSettings, ...data }
  } catch {
    return defaultSiteSettings
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!hasSanityConfig) return defaultAbout

  try {
    const data = await client.fetch<AboutContent | null>(
      aboutQuery,
      {},
      { next: { revalidate: 30, tags: ["about"] } }
    )
    if (!data) return defaultAbout
    return {
      bio: data.bio?.length ? data.bio : defaultAbout.bio,
      education: data.education?.length ? data.education : defaultAbout.education,
      exhibitions: data.exhibitions?.length ? data.exhibitions : defaultAbout.exhibitions,
      awards: data.awards?.length ? data.awards : defaultAbout.awards,
    }
  } catch {
    return defaultAbout
  }
}

export async function getWorks(): Promise<Project[]> {
  if (!hasSanityConfig) return PROJECTS

  try {
    const data = await client.fetch<SanityWork[]>(
      worksQuery,
      {},
      { next: { revalidate: 30, tags: ["works"] } }
    )
    const works = normalizeWorks(data)
    return works.length ? works : PROJECTS
  } catch {
    return PROJECTS
  }
}

export async function getFeaturedWorks(): Promise<Project[]> {
  if (!hasSanityConfig) {
    return PROJECTS.filter((p) =>
      ["Orchid Studies", "Coastal Thresholds"].includes(p.series)
    )
  }

  try {
    const featured = normalizeWorks(
      await client.fetch<SanityWork[]>(
        featuredWorksQuery,
        {},
        { next: { revalidate: 30, tags: ["works"] } }
      )
    )
    if (featured.length) return featured

    const all = await getWorks()
    return all.slice(0, 8)
  } catch {
    return PROJECTS.filter((p) =>
      ["Orchid Studies", "Coastal Thresholds"].includes(p.series)
    )
  }
}

export async function getShopWorks(): Promise<Project[]> {
  if (!hasSanityConfig) return PROJECTS.filter((p) => p.forSale)

  try {
    const data = await client.fetch<SanityWork[]>(
      shopWorksQuery,
      {},
      { next: { revalidate: 30, tags: ["works"] } }
    )
    const works = normalizeWorks(data)
    return works.length ? works : PROJECTS.filter((p) => p.forSale)
  } catch {
    return PROJECTS.filter((p) => p.forSale)
  }
}

export async function getWorkBySlug(slug: string): Promise<Project | undefined> {
  if (!hasSanityConfig) return PROJECTS.find((p) => p.id === slug)

  try {
    const data = await client.fetch<SanityWork | null>(
      workBySlugQuery,
      { slug },
      { next: { revalidate: 30, tags: ["works"] } }
    )
    const work = normalizeWork(data)
    if (work) return work
    return PROJECTS.find((p) => p.id === slug)
  } catch {
    return PROJECTS.find((p) => p.id === slug)
  }
}

export async function getSeriesNames(): Promise<string[]> {
  if (!hasSanityConfig) {
    return Array.from(new Set(PROJECTS.map((p) => p.series)))
  }

  try {
    const fromSeries = await client.fetch<{ title?: string }[]>(
      seriesQuery,
      {},
      { next: { revalidate: 30, tags: ["series"] } }
    )
    const titles = (fromSeries || []).map((s) => s.title).filter(Boolean) as string[]
    if (titles.length) return titles

    const works = await getWorks()
    return Array.from(new Set(works.map((p) => p.series)))
  } catch {
    return Array.from(new Set(PROJECTS.map((p) => p.series)))
  }
}

export async function getWorkSiblings(id: string): Promise<{ prev: Project; next: Project }> {
  const works = await getWorks()
  const idx = works.findIndex((p) => p.id === id)
  const safeIdx = idx < 0 ? 0 : idx
  const prev = works[(safeIdx - 1 + works.length) % works.length]
  const next = works[(safeIdx + 1) % works.length]
  return { prev, next }
}
