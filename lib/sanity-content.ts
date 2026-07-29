export type SiteSettings = {
  heroStatement?: string
  heroCtaLabel?: string
  basedIn?: string
  bornIn?: string
  exhibitionBanner?: string
  heroVideoUrl?: string
  email?: string
  instagram?: string
  contactIntro?: string
  newsletterIntro?: string
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
  heroCtaLabel: "See Works →",
  basedIn: "Based in Oslo",
  bornIn: "Born in 1997",
  exhibitionBanner: "Exhibition at Galleri Tjøme 25. July — 08. August",
  heroVideoUrl: "/hero.mp4",
  email: "post@emilie.no",
  instagram: "#",
  contactIntro:
    "Available for private inquiries, commissions, and exhibition collaborations. Based in Norway, shipping internationally.",
  newsletterIntro: "Subscribe for the latest exhibitions and creations.",
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
