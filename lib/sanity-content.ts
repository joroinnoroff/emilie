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
  /** Unmute control in fullscreen when true. Page autoplay stays muted. */
  heroVideoAudio?: boolean
  email?: string
  instagram?: string
  contactIntro?: string
  contactIntroNb?: string
  newsletterIntro?: string
  newsletterIntroNb?: string
  commissionHeading?: string
  commissionHeadingNb?: string
  commissionBody?: string[]
  commissionBodyNb?: string[]
  commissionCta?: string
  commissionCtaNb?: string
  deliveryOptions?: DeliveryOption[]
}

export type CvItem = {
  year?: string
  title?: string
  detail?: string
}

export type AboutContent = {
  bio?: string[]
  bioNb?: string[]
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
  heroVideoAudio: false,
  email: "post@emilie.no",
  instagram: "#",
  contactIntro:
    "Available for private inquiries, commissions, and exhibition collaborations. Based in Norway, shipping internationally.",
  contactIntroNb:
    "Tilgjengelig for private henvendelser, bestillingsverk og utstillingssamarbeid. Basert i Norge, sender internasjonalt.",
  newsletterIntro: "Subscribe for the latest exhibitions and creations.",
  newsletterIntroNb: "Abonner for siste utstillinger og verk.",
  commissionHeading: "Looking for a Custom Artwork?",
  commissionHeadingNb: "Ønsker du et verk?",
  commissionBody: [
    "Do you have an idea, a memory, or a subject you'd like to see interpreted through my artistic style? I accept a limited number of commissioned pieces, allowing us to create a one-of-a-kind painting tailored specifically to your vision.",
    "The process begins with a consultation, either in person or over FaceTime, where we explore your ideas together. We'll look through my previous works, discuss which pieces resonate with you and why, and talk about the colours, composition, atmosphere, and any specific elements you'd like your painting to include.",
    "To reserve a commission, a 5,000 NOK deposit is required. This covers the consultation, planning process, my time, and the canvas used for the artwork. The remaining balance is paid upon completion and delivery of the finished painting.",
    "The final price is based on the size and complexity of the artwork and follows the same pricing structure as my existing collection. If you're interested in creating something unique together, I'd be happy to schedule an initial consultation.",
  ],
  commissionBodyNb: [
    "Har du en idé, et minne eller et motiv du ønsker å få tolket gjennom min kunst? Jeg tar imot et begrenset antall kommisjonsoppdrag, hvor vi sammen skaper et unikt maleri med utgangspunkt i min visuelle stil.",
    "Prosessen starter med en samtale – enten fysisk eller via FaceTime – hvor vi blir kjent med ideen din. Vi ser gjennom tidligere verk, finner ut hvilke uttrykk, farger og komposisjoner du trekkes mot, og snakker om motiv, størrelse og stemningen du ønsker at maleriet skal formidle.",
    "For å reservere et kommisjonsoppdrag betales et depositum på 5 000 kr. Depositumet dekker planleggingsprosessen, min tid og lerretet som brukes til verket. Når arbeidet er ferdigstilt og klart for overlevering, betales det resterende beløpet.",
    "Prisen på et kommisjonsverk følger samme nivå som mine øvrige malerier og varierer ut fra størrelse og omfang. Ta gjerne kontakt dersom du ønsker et uforpliktende møte for å diskutere ideen din.",
  ],
  commissionCta: "Contact",
  commissionCtaNb: "Kontakt",
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
  bioNb: [
    "Arbeidene mine utforsker rommet mellom det gjenkjennelige og det forestilte. Jeg henter inspirasjon fra hverdagslige objekter, naturformer og øyeblikk som bærer med seg en følelse av minner — og setter dem sammen til rolige, drømmende komposisjoner.",
    "Jeg arbeider hovedsakelig med olje på lerret, og utforsker forholdet mellom farge, form, lys og symbolikk. I maleriene kombinerer jeg ofte elementer fra naturen med geometriske former og nøye oppbygde rom. Resultatet er scener som føles både kjente og litt forskjøvet fra virkeligheten.",
    "Prosessen starter med observasjon, men det ferdige maleriet handler ikke nødvendigvis om å gjengi det jeg ser. Jeg er mer opptatt av følelsen som oppstår. Hvordan farger og komposisjon kan vekke minner, følelser og assosiasjoner uten at bildet trenger å fortelle én bestemt historie.",
  ],
  education: [
    {
      year: "",
      title: "Einar Granum Kunstfagskole",
      detail: "Visuelle kunstfag, Oslo",
    },
  ],
  exhibitions: [],
  awards: [],
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
