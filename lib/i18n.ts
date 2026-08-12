export type Locale = "en" | "nb"

const messages = {
  en: {
    "nav.works": "Work",
    "nav.about": "About",
    "nav.shop": "Gallery",
    "nav.contact": "Contact",
    "nav.cart": "Selection",
    "works.heading": "Selected Works",
    "works.all": "See all →",
    "works.info": "Info",
    "shop.heading": "Art for sale",
    "shop.all": "See all works →",
    "shop.view": "View",
    "shop.back": "Back to gallery",
    "shop.allTitle": "All art for sale",
    "shop.empty": "No products found",
    "shop.loading": "Loading shop…",
    "shop.noMatch": "No works match this filter.",
    "shop.original": "Original",
    "shop.print": "Print",
    "shop.selectVersion": "Version",
    "shop.selectSize": "Print size",
    "shop.addToCart": "Send an inquiry",
    "shop.inCart": "View inquiry",
    "shop.sold": "Sold",
    "shop.available": "Available",
    "shop.unique": "Unique original",
    "shop.printsAvailable": "Print",
    "shop.offerBoth": "Original  ·  Print",
    "shop.offerOriginal": "Original",
    "shop.description": "Description",
    "shop.fullscreen": "Fullscreen",
    "shop.medium": "Medium",
    "shop.originalSize": "Original size",
    "shop.status": "Status",
    "shop.prints": "Prints",
    "shop.printsInSizes": "Available in {count} size",
    "shop.printsInSizesPlural": "Available in {count} sizes",
    "shop.printsUnavailable": "Unavailable",
    "shop.filter.all": "All",
    "shop.filter.size": "Size",
    "shop.filter.type": "Type",
    "shop.filter.price": "Price",
    "shop.filter.prints": "Prints",
    "shop.filter.year": "Year",
    "shop.filter.series": "Series",
    "shop.filter.price.low": "Under €500",
    "shop.filter.price.mid": "€500 – €1,500",
    "shop.filter.price.high": "€1,500+",
    "shop.filter.price.lowNb": "Under 5 000 kr",
    "shop.filter.price.midNb": "5 000 – 15 000 kr",
    "shop.filter.price.highNb": "15 000 kr+",
    "projects.heading": "All Projects",
    "projects.all": "All",
    "projects.prev": "← Previous",
    "projects.next": "Next →",
    "projects.viewShop": "View in Gallery",
    "projects.size": "Size",
    "checkout.title": "Inquiry",
    "checkout.payStripe": "Pay with card",
    "checkout.processing": "Redirecting to Stripe…",
    "checkout.empty": "Nothing selected yet.",
    "checkout.summary": "Summary",
    "checkout.remove": "Remove",
    "inquiry.askingAbout": "Asking about",
    "inquiry.intro":
      "Fill in your details below. I’ll get back to you using the contact information you provide — with availability and next steps for the selected work(s).",
    "inquiry.name": "Name",
    "inquiry.email": "Email",
    "inquiry.phone": "Phone number",
    "inquiry.shipping": "Shipping address / location",
    "inquiry.shippingPlaceholder": "Street, postal code, city, country",
    "inquiry.message": "Message",
    "inquiry.messagePlaceholder": "Anything I should know…",
    "inquiry.submit": "Send inquiry",
    "inquiry.sending": "Sending…",
    "inquiry.continueBrowse": "Continue to browse",
    "inquiry.successTitle": "Inquiry sent",
    "inquiry.successBody":
      "Thank you. I’ll review your request and contact you using the details you provided.",
    "inquiry.errorRequired": "Please fill in name, email, phone, and shipping location.",
    "inquiry.errorEmail": "Invalid email.",
    "inquiry.errorSend": "Could not send the inquiry. Please try again.",
    "currency.nok": "kr",
    "currency.eur": "€",
    "footer.rights": "© 2026 Emilie. All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "legal.title": "Privacy & Terms",
    "legal.toc": "Contents",
    "legal.tocPrivacy": "Privacy",
    "legal.tocCookies": "Cookies",
    "legal.tocData": "Your data",
    "legal.tocRights": "Your rights",
    "legal.tocTerms": "Terms",
    "legal.tocOrders": "Inquiries & sales",
    "legal.tocArt": "Artworks",
    "legal.tocPayment": "Payment & delivery",
    "cookies.title": "Cookies",
    "cookies.body":
      "We use cookies so the site works properly. We only use what is strictly necessary — nothing for ads or tracking.",
    "cookies.necessaryNote":
      "Necessary: language and your selection for inquiries. We only process information you choose to give us.",
    "cookies.accept": "Accept",
    "cookies.readMore": "Read more",
    "cookies.legalMenu": "Privacy and terms",
    "privacy.title": "Privacy & cookies",
    "privacy.intro":
      "This site is built to stay simple and respectful of your privacy. We do not sell personal data, and we do not use advertising or analytics cookies.",
    "privacy.necessaryTitle": "Strictly necessary cookies",
    "privacy.necessaryBody":
      "These cookies and local storage are required for basic functionality: remembering your language choice and keeping artworks in your inquiry selection. Without them, the shop and site preferences would not work as expected.",
    "privacy.dataTitle": "Information you give us",
    "privacy.dataBody":
      "If you contact us, subscribe, or send an artwork inquiry, we only use the details you provide for that purpose — for example answering your message or arranging a purchase by email.",
    "privacy.rightsTitle": "Your rights",
    "privacy.rightsBody":
      "Under GDPR you can ask what personal data we hold about you, request correction or deletion, and object to processing where applicable. Contact us anytime if you have questions.",
    "privacy.contact": "Questions? Write to",
    "terms.title": "Terms",
    "terms.intro":
      "By using this website and sending an inquiry, you agree to these simple terms. They are written to be clear — please contact us if anything is unclear.",
    "terms.ordersTitle": "Inquiries & sales",
    "terms.ordersBody":
      "Artworks are not sold with online checkout on this site. An inquiry is a request, not a binding purchase. If the work is available, we send an invoice by email. Availability of originals and prints can change; sold pieces are marked as such on the site.",
    "terms.artTitle": "Artworks",
    "terms.artBody":
      "Each original is unique. Prints are produced according to the edition details shown on the product page. Colours may vary slightly between screen and physical work.",
    "terms.paymentTitle": "Payment & delivery",
    "terms.paymentBody":
      "Prices shown are indicative. Final payment is by invoice after we confirm availability. Shipping is calculated from the address or location you provide in the inquiry and included on the invoice.",
  },
  nb: {
    "nav.works": "Arbeid",
    "nav.about": "Om meg",
    "nav.shop": "Galleri",
    "nav.contact": "Kontakt",
    "nav.cart": "Utvalg",
    "works.heading": "Utvalgte verk",
    "works.all": "Se alle →",
    "works.info": "Info",
    "shop.heading": "Kunst til salgs",
    "shop.all": "Se alle verk →",
    "shop.view": "Se",
    "shop.back": "Tilbake til galleri",
    "shop.allTitle": "Alle verk til salgs",
    "shop.empty": "Ingen produkter funnet",
    "shop.loading": "Laster butikk…",
    "shop.noMatch": "Ingen verk matcher dette filteret.",
    "shop.original": "Original",
    "shop.print": "Trykk",
    "shop.selectVersion": "Versjon",
    "shop.selectSize": "Trykkstørrelse",
    "shop.addToCart": "Send en forespørsel",
    "shop.inCart": "Se forespørsel",
    "shop.sold": "Solgt",
    "shop.available": "Tilgjengelig",
    "shop.unique": "Unik original",
    "shop.printsAvailable": "Trykk",
    "shop.offerBoth": "Original  ·  Trykk",
    "shop.offerOriginal": "Original",
    "shop.description": "Beskrivelse",
    "shop.fullscreen": "Fullskjerm",
    "shop.medium": "Teknikk",
    "shop.originalSize": "Original størrelse",
    "shop.status": "Status",
    "shop.prints": "Trykk",
    "shop.printsInSizes": "Tilgjengelig i {count} størrelse",
    "shop.printsInSizesPlural": "Tilgjengelig i {count} størrelser",
    "shop.printsUnavailable": "Utilgjengelig",
    "shop.filter.all": "Alle",
    "shop.filter.size": "Størrelse",
    "shop.filter.type": "Type",
    "shop.filter.price": "Pris",
    "shop.filter.prints": "Trykk",
    "shop.filter.year": "År",
    "shop.filter.series": "Serie",
    "shop.filter.price.low": "Under €500",
    "shop.filter.price.mid": "€500 – €1,500",
    "shop.filter.price.high": "€1,500+",
    "shop.filter.price.lowNb": "Under 5 000 kr",
    "shop.filter.price.midNb": "5 000 – 15 000 kr",
    "shop.filter.price.highNb": "15 000 kr+",
    "projects.heading": "Alle prosjekter",
    "projects.all": "Alle",
    "projects.prev": "← Forrige",
    "projects.next": "Neste →",
    "projects.viewShop": "Se i galleri",
    "projects.size": "Størrelse",
    "checkout.title": "Forespørsel",
    "checkout.payStripe": "Betal med kort",
    "checkout.processing": "Sender deg til Stripe…",
    "checkout.empty": "Ingen verk valgt ennå.",
    "checkout.summary": "Oppsummering",
    "checkout.remove": "Fjern",
    "inquiry.askingAbout": "Forespørsel om",
    "inquiry.intro":
      "Fyll inn opplysningene under. Jeg tar kontakt med deg ut fra informasjonen du oppgir — med tilgjengelighet og videre steg for valgte verk.",
    "inquiry.name": "Navn",
    "inquiry.email": "E-post",
    "inquiry.phone": "Telefonnummer",
    "inquiry.shipping": "Leveringsadresse / sted",
    "inquiry.shippingPlaceholder": "Gate, postnummer, by, land",
    "inquiry.message": "Melding",
    "inquiry.messagePlaceholder": "Noe jeg bør vite…",
    "inquiry.submit": "Send forespørsel",
    "inquiry.sending": "Sender…",
    "inquiry.continueBrowse": "Fortsett å se",
    "inquiry.successTitle": "Forespørsel sendt",
    "inquiry.successBody":
      "Takk. Jeg går gjennom forespørselen din og tar kontakt med deg på opplysningene du har oppgitt.",
    "inquiry.errorRequired": "Fyll inn navn, e-post, telefon og leveringssted.",
    "inquiry.errorEmail": "Ugyldig e-post.",
    "inquiry.errorSend": "Kunne ikke sende forespørselen. Prøv igjen.",
    "currency.nok": "kr",
    "currency.eur": "€",
    "footer.rights": "© 2026 Emilie. Alle rettigheter forbeholdt.",
    "footer.privacy": "Personvern",
    "footer.terms": "Vilkår",
    "legal.title": "Personvern & Vilkår",
    "legal.toc": "Innhold",
    "legal.tocPrivacy": "Personvern",
    "legal.tocCookies": "Informasjonskapsler",
    "legal.tocData": "Dine data",
    "legal.tocRights": "Dine rettigheter",
    "legal.tocTerms": "Vilkår",
    "legal.tocOrders": "Forespørsler og salg",
    "legal.tocArt": "Kunstverk",
    "legal.tocPayment": "Betaling og levering",
    "cookies.title": "Informasjonskapsler",
    "cookies.body":
      "Vi bruker informasjonskapsler for at nettsiden skal fungere. Vi bruker kun det som er strengt nødvendig — ikke til annonser eller sporing.",
    "cookies.necessaryNote":
      "Nødvendig: språk og utvalg til forespørsel. Vi behandler bare informasjon du selv velger å gi oss.",
    "cookies.accept": "Godta",
    "cookies.readMore": "Les mer",
    "cookies.legalMenu": "Personvern og vilkår",
    "privacy.title": "Personvern og informasjonskapsler",
    "privacy.intro":
      "Denne siden er laget for å være enkel og respektfull overfor personvernet ditt. Vi selger ikke personopplysninger, og vi bruker ikke annonse- eller analysekapsler.",
    "privacy.necessaryTitle": "Nødvendige informasjonskapsler",
    "privacy.necessaryBody":
      "Disse er nødvendige for grunnleggende funksjoner: huske språkvalg og beholde verk i forespørselsutvalget. Uten dem ville ikke galleriet og innstillingene fungert som forventet.",
    "privacy.dataTitle": "Informasjon du gir oss",
    "privacy.dataBody":
      "Hvis du kontakter oss, melder deg på eller sender en forespørsel om kunst, bruker vi kun opplysningene du gir til det formålet — for eksempel å svare på meldingen din eller avtale kjøp på e-post.",
    "privacy.rightsTitle": "Dine rettigheter",
    "privacy.rightsBody":
      "Etter GDPR kan du be om innsyn i personopplysninger vi har om deg, be om retting eller sletting, og protestere mot behandling der det er relevant. Ta gjerne kontakt hvis du har spørsmål.",
    "privacy.contact": "Spørsmål? Skriv til",
    "terms.title": "Vilkår",
    "terms.intro":
      "Ved å bruke nettsiden og sende en forespørsel godtar du disse enkle vilkårene. De er skrevet for å være tydelige — ta kontakt hvis noe er uklart.",
    "terms.ordersTitle": "Forespørsler og salg",
    "terms.ordersBody":
      "Kunstverk selges ikke med nettbetaling på denne siden. En forespørsel er en henvendelse, ikke et bindende kjøp. Hvis verket er tilgjengelig, sender vi faktura på e-post. Tilgjengelighet for originaler og trykk kan endre seg; solgte verk er merket som solgt på siden.",
    "terms.artTitle": "Kunstverk",
    "terms.artBody":
      "Hver original er unik. Trykk produseres etter opplagsdetaljene som vises på produktsiden. Farger kan variere litt mellom skjerm og fysisk verk.",
    "terms.paymentTitle": "Betaling og levering",
    "terms.paymentBody":
      "Priser som vises er veiledende. Endelig betaling skjer via faktura etter at vi har bekreftet tilgjengelighet. Frakt beregnes ut fra adressen eller stedet du oppgir i forespørselen, og tas med på fakturaen.",
  },
} as const

export type MessageKey = keyof typeof messages.en

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? messages.en[key] ?? key
}

export function tCount(
  locale: Locale,
  singular: MessageKey,
  plural: MessageKey,
  count: number
): string {
  const key = count === 1 ? singular : plural
  return t(locale, key).replace("{count}", String(count))
}

/** English → EUR, Norwegian → NOK */
export function formatMoney(
  locale: Locale,
  prices: { priceNok?: number | null; priceEur?: number | null }
): string {
  if (locale === "nb") {
    if (prices.priceNok != null) {
      return `${prices.priceNok.toLocaleString("nb-NO")} kr`
    }
    if (prices.priceEur != null) {
      return `€${prices.priceEur.toLocaleString("nb-NO")}`
    }
  } else {
    if (prices.priceEur != null) {
      return `€${prices.priceEur.toLocaleString("en-GB")}`
    }
    if (prices.priceNok != null) {
      return `${prices.priceNok.toLocaleString("nb-NO")} kr`
    }
  }
  return "—"
}

export function checkoutCurrency(locale: Locale): "eur" | "nok" {
  return locale === "nb" ? "nok" : "eur"
}
