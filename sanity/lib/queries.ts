import { groq } from "next-sanity"

export const worksQuery = groq`
  *[_type == "work"] | order(year desc) {
    _id,
    title,
    "id": slug.current,
    "series": series->title,
    year,
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
    description
  }
`

export const workBySlugQuery = groq`
  *[_type == "work" && slug.current == $slug][0] {
    _id,
    title,
    "id": slug.current,
    "series": series->title,
    year,
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
    description
  }
`

export const featuredWorksQuery = groq`
  *[_type == "work" && featured == true] | order(year desc) {
    _id,
    title,
    "id": slug.current,
    "series": series->title,
    year,
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
    description
  }
`

export const shopWorksQuery = groq`
  *[_type == "work" && forSale == true && status != "Sold"] | order(year desc) {
    _id,
    title,
    "id": slug.current,
    "series": series->title,
    year,
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
    description
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
    heroCtaLabel,
    basedIn,
    bornIn,
    exhibitionBanner,
    "heroVideoUrl": heroVideo.asset->url,
    email,
    instagram,
    contactIntro,
    newsletterIntro
  }
`

export const aboutQuery = groq`
  coalesce(
    *[_id == "about"][0],
    *[_type == "about"][0]
  ) {
    bio,
    education,
    exhibitions,
    awards
  }
`
