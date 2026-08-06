export type DeliveryOption = {
  key: "pickup" | "norway" | "abroad"
  label?: string
  labelNb?: string
  priceNok: number
  priceEur: number
  enabled?: boolean
}

export type SiteSettings = {
  heroStatement?: string
  heroStatementNb?: string
  heroCtaLabel?: string
  heroCtaLabelNb?: string
  basedIn?: string
  basedInNb?: string
  bornIn?: string
  bornInNb?: string
  exhibitionBanner?: string
  exhibitionBannerNb?: string
  heroVideoUrl?: string
  email?: string
  instagram?: string
  contactIntro?: string
  contactIntroNb?: string
  newsletterIntro?: string
  newsletterIntroNb?: string
  deliveryOptions?: DeliveryOption[]
}

export type CvItem = {
  year?: string
  title?: string
  detail?: string
}

export type AboutContent = {
  bio?: string[]
  education?: CvItem[]
  exhibitions?: CvItem[]
  awards?: CvItem[]
}

export const defaultSiteSettings: SiteSettings = {
  heroStatement: "Hi, I'm Emilie. Previous student at Einar Granum Kunstfagskole",
  heroStatementNb:
    "Hei, jeg er Emilie. Tidligere elev ved Einar Granum Kunstfagskole",
  heroCtaLabel: "See Works →",
  heroCtaLabelNb: "Se arbeider →",
  basedIn: "Based in Oslo",
  basedInNb: "Basert i Oslo",
  bornIn: "Born in 1997",
  bornInNb: "Født i 1997",
  exhibitionBanner: "Exhibition at Galleri Tjøme 25. July — 08. August",
  exhibitionBannerNb: "Utstilling på Galleri Tjøme 25. juli — 08. august",
  heroVideoUrl: "/hero.mp4",
  email: "post@emilie.no",
  instagram: "#",
  contactIntro:
    "Available for private inquiries, commissions, and exhibition collaborations. Based in Norway, shipping internationally.",
  contactIntroNb:
    "Tilgjengelig for private henvendelser, bestillingsverk og utstillingssamarbeid. Basert i Norge, sender internasjonalt.",
  newsletterIntro: "Subscribe for the latest exhibitions and creations.",
  newsletterIntroNb: "Abonner for siste utstillinger og verk.",
  deliveryOptions: [
    {
      key: "pickup",
      label: "Pick-up in Oslo",
      labelNb: "Henting i Oslo",
      priceNok: 0,
      priceEur: 0,
      enabled: true,
    },
    {
      key: "norway",
      label: "Shipping in Norway",
      labelNb: "Frakt i Norge",
      priceNok: 150,
      priceEur: 15,
      enabled: true,
    },
    {
      key: "abroad",
      label: "Shipping abroad",
      labelNb: "Frakt til utlandet",
      priceNok: 350,
      priceEur: 35,
      enabled: true,
    },
  ],
}

export const defaultAbout: AboutContent = {
  bio: [
    "My work moves between still life and dreamscape — orchids, shells, birds, and everyday objects placed in soft, cloud-lit environments that feel just slightly out of time. Each painting begins as a study of a single object and grows into a quiet scene about memory, care, and the tension between abundance and absence.",
    "Working primarily in oil on canvas, I'm drawn to coastal light, classical staging, and symbols borrowed from surrealism — thresholds, orbs, and the space between interior and horizon.",
  ],
  education: [
    { year: "2023–2025", title: "[MFA Fine Art]", detail: "[Academy Name]" },
    { year: "2019–2022", title: "[BA Visual Art]", detail: "[University Name]" },
  ],
  exhibitions: [
    { year: "2025", title: "[Exhibition Title]", detail: "Solo, [Gallery], Oslo" },
    { year: "2024", title: "[Exhibition Title]", detail: "Group, [Gallery], Bergen" },
    { year: "2023", title: "[Exhibition Title]", detail: "Group, [Gallery], Copenhagen" },
  ],
  awards: [{ year: "2024", title: "[Award Name]", detail: "[Institution]" }],
}

/** Pick EN or NO Sanity string with fallback. */
export function localized(
  locale: "en" | "nb",
  en?: string | null,
  nb?: string | null
): string {
  if (locale === "nb") return (nb || en || "").trim()
  return (en || nb || "").trim()
}
