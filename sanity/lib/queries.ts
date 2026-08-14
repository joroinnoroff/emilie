import { groq } from "next-sanity"

const workFields = `
  _id,
  title,
  "id": slug.current,
  "series": series->title,
  year,
  images,
  image,
  medium,
  size,
  stock,
  priceNok,
  priceEur,
  priceUsd,
  price,
  status,
  forSale,
  featured,
  printAvailable,
  prints[]{
    size,
    stock,
    priceNok,
    priceEur
  },
  description
`

export const worksQuery = groq`
  *[_type == "work"] | order(year desc) {
    ${workFields}
  }
`

export const workBySlugQuery = groq`
  *[_type == "work" && slug.current == $slug][0] {
    ${workFields}
  }
`

/** Ordered list from Site Settings — preserves drag order */
export const featuredWorksOrderedQuery = groq`
  *[_type == "siteSettings"][0]{
    "works": featuredWorks[]->{
      ${workFields}
    }
  }.works
`

/** Fallback when Site Settings list is empty */
export const featuredWorksQuery = groq`
  *[_type == "work" && featured == true] | order(year desc) {
    ${workFields}
  }
`

export const shopWorksQuery = groq`
  *[_type == "work" && forSale == true && (status != "Sold" || printAvailable == true)] | order(year desc) {
    ${workFields}
  }
`

export const seriesQuery = groq`
  *[_type == "series"] | order(title asc) {
    _id,
    title,
    "id": slug.current,
    description
  }
`

export const siteSettingsQuery = groq`
  coalesce(
    *[_id == "siteSettings"][0],
    *[_type == "siteSettings"][0]
  ) {
    heroStatement,
    heroStatementNb,
    heroCtaLabel,
    heroCtaLabelNb,
    basedIn,
    basedInNb,
    bornIn,
    bornInNb,
    exhibitionBanner,
    exhibitionBannerNb,
    "heroVideoUrl": heroVideo.asset->url,
    heroVideoAudio,
    email,
    instagram,
    contactIntro,
    contactIntroNb,
    newsletterIntro,
    newsletterIntroNb,
    commissionHeading,
    commissionHeadingNb,
    commissionBody,
    commissionBodyNb,
    commissionCta,
    commissionCtaNb,
    deliveryOptions[]{
      key,
      label,
      labelNb,
      priceNok,
      priceEur,
      enabled
    }
  }
`

export const aboutQuery = groq`
  coalesce(
    *[_id == "about"][0],
    *[_type == "about"][0]
  ) {
    portrait,
    bio,
    bioNb,
    education,
    exhibitions,
    awards
  }
`
