import { client, hasSanityConfig, urlFor } from "@/sanity/lib/client"
import {
  aboutQuery,
  featuredWorksOrderedQuery,
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
import { PROJECTS, type PrintEdition, type Project, type Status } from "@/lib/projects"
import { formatMoney } from "@/lib/i18n"

type SanityPrint = {
  size?: string | null
  stock?: number | null
  priceNok?: number | null
  priceEur?: number | null
}

type SanityWork = {
  _id?: string
  id?: string | null
  title?: string | null
  series?: string | null
  year?: string | null
  images?: unknown[]
  /** @deprecated legacy single-image field, kept for backward compatibility */
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
  printAvailable?: boolean | null
  prints?: SanityPrint[] | null
  description?: string | null
}

function normalizePrints(prints: SanityPrint[] | null | undefined): PrintEdition[] {
  return (prints || [])
    .filter((p) => p?.size)
    .map((p) => ({
      size: p.size as string,
      stock: typeof p.stock === "number" ? p.stock : 0,
      priceNok: p.priceNok ?? undefined,
      priceEur: p.priceEur ?? undefined,
    }))
}

/** Prefer numeric Sanity prices so NOK always includes "kr". */
function formatDisplayPrice(doc: SanityWork): string {
  const formatted = formatMoney("en", {
    priceNok: doc.priceNok,
    priceEur: doc.priceEur,
  })
  if (formatted !== "—") return formatted
  if (doc.priceUsd != null) return `$${doc.priceUsd.toLocaleString("en-US")}`
  // Ignore bare numbers in the old display field (e.g. "900")
  if (doc.price && !/^\d+([.,]\d+)?$/.test(doc.price.trim())) return doc.price
  return "—"
}

function normalizeWork(doc: SanityWork | null | undefined): Project | null {
  if (!doc?.id || !doc?.title) return null

  let image = ""
  let gallery: string[] = []
  try {
    const images = (doc.images || []) as Parameters<typeof urlFor>[0][]
    const urls = images
      .map((img) => {
        try {
          return urlFor(img).width(1400).url()
        } catch {
          return ""
        }
      })
      .filter(Boolean)
    if (urls.length) {
      image = urls[0]
      gallery = urls.slice(1)
    } else if (doc.image) {
      // Fall back to the legacy single-image field for works not yet migrated
      image = urlFor(doc.image as Parameters<typeof urlFor>[0]).width(1400).url()
    }
  } catch {
    image = ""
    gallery = []
  }

  const status: Status = doc.status === "Sold" ? "Sold" : "Available"
  const stock = typeof doc.stock === "number" ? doc.stock : status === "Sold" ? 0 : 1
  const prints = normalizePrints(doc.prints)
  const hasPrintStock = Boolean(doc.printAvailable) && prints.some((p) => p.stock > 0)
  const originalForSale = Boolean(doc.forSale) && status !== "Sold" && stock > 0

  return {
    id: doc.id,
    sanityId: doc._id,
    title: doc.title,
    series: doc.series || "Works",
    year: doc.year || "",
    image,
    gallery,
    medium: doc.medium || "Oil on canvas",
    size: doc.size || "",
    stock,
    priceNok: doc.priceNok ?? undefined,
    priceEur: doc.priceEur ?? undefined,
    priceUsd: doc.priceUsd ?? undefined,
    price: formatDisplayPrice(doc),
    status,
    forSale: originalForSale || hasPrintStock,
    printAvailable: Boolean(doc.printAvailable),
    prints,
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
    const merged = { ...defaultSiteSettings, ...data }
    if (!merged.deliveryOptions?.length) {
      merged.deliveryOptions = defaultSiteSettings.deliveryOptions
    }
    if (!merged.commissionBody?.length) {
      merged.commissionBody = defaultSiteSettings.commissionBody
    }
    if (!merged.commissionBodyNb?.length) {
      merged.commissionBodyNb = defaultSiteSettings.commissionBodyNb
    }
    return merged
  } catch {
    return defaultSiteSettings
  }
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!hasSanityConfig) return defaultAbout

  try {
    const data = await client.fetch<{
      portrait?: Parameters<typeof urlFor>[0]
      bio?: string[]
      bioNb?: string[]
      education?: AboutContent["education"]
      exhibitions?: AboutContent["exhibitions"]
      awards?: AboutContent["awards"]
    } | null>(aboutQuery, {}, { next: { revalidate: 30, tags: ["about"] } })
    if (!data) return defaultAbout

    let portraitUrl = defaultAbout.portraitUrl
    if (data.portrait) {
      try {
        portraitUrl = urlFor(data.portrait).width(1200).url()
      } catch {
        // keep default
      }
    }

    return {
      portraitUrl,
      bio: data.bio?.length ? data.bio : defaultAbout.bio,
      bioNb: data.bioNb?.length ? data.bioNb : defaultAbout.bioNb,
      education: data.education?.length ? data.education : defaultAbout.education,
      exhibitions: data.exhibitions?.length ? data.exhibitions : [],
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
    const fetchOpts = { next: { revalidate: 30, tags: ["works", "siteSettings"] } }

    const orderedDocs = await client.fetch<(SanityWork | null)[]>(
      featuredWorksOrderedQuery,
      {},
      fetchOpts
    )
    const ordered = normalizeWorks(
      orderedDocs.filter((doc): doc is SanityWork => doc != null)
    )
    if (ordered.length) return ordered

    const featured = normalizeWorks(
      await client.fetch<SanityWork[]>(featuredWorksQuery, {}, fetchOpts)
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

export async function getShopSiblings(id: string): Promise<{ prev: Project; next: Project }> {
  const works = await getShopWorks()
  const idx = works.findIndex((p) => p.id === id)
  const safeIdx = idx < 0 ? 0 : idx
  const prev = works[(safeIdx - 1 + works.length) % works.length]
  const next = works[(safeIdx + 1) % works.length]
  return { prev, next }
}
