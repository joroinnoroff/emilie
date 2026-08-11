export type Locale = "en" | "nb"

const messages = {
  en: {
    "nav.works": "Work",
    "nav.about": "About",
    "nav.shop": "Gallery",
    "nav.contact": "Contact",
    "nav.cart": "Cart",
    "works.heading": "Selected Works",
    "works.all": "All Projects →",
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
    "shop.addToCart": "Add to Cart",
    "shop.inCart": "In cart",
    "shop.sold": "Sold",
    "shop.available": "Available",
    "shop.unique": "Unique original",
    "shop.printsAvailable": "Print",
    "shop.offerBoth": "Original · Print",
    "shop.offerOriginal": "Original",
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
    "projects.heading": "All Projects",
    "projects.all": "All",
    "projects.prev": "← Previous",
    "projects.next": "Next →",
    "projects.viewShop": "View in Gallery",
    "projects.size": "Size",
    "checkout.title": "Checkout",
    "checkout.payStripe": "Pay with card",
    "checkout.processing": "Redirecting to Stripe…",
    "checkout.empty": "Your cart is empty.",
    "checkout.summary": "Summary",
    "checkout.remove": "Remove",
    "currency.nok": "kr",
    "currency.eur": "€",
    "footer.rights": "© 2026 Emilie. All rights reserved.",
  },
  nb: {
    "nav.works": "Arbeid",
    "nav.about": "Om meg",
    "nav.shop": "Galleri",
    "nav.contact": "Kontakt",
    "nav.cart": "Handlekurv",
    "works.heading": "Utvalgte verk",
    "works.all": "Alle prosjekter →",
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
    "shop.addToCart": "Legg i handlekurv",
    "shop.inCart": "I handlekurven",
    "shop.sold": "Solgt",
    "shop.available": "Tilgjengelig",
    "shop.unique": "Unik original",
    "shop.printsAvailable": "Trykk",
    "shop.offerBoth": "Original · Trykk",
    "shop.offerOriginal": "Original",
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
    "projects.heading": "Alle prosjekter",
    "projects.all": "Alle",
    "projects.prev": "← Forrige",
    "projects.next": "Neste →",
    "projects.viewShop": "Se i galleri",
    "projects.size": "Størrelse",
    "checkout.title": "Kasse",
    "checkout.payStripe": "Betal med kort",
    "checkout.processing": "Sender deg til Stripe…",
    "checkout.empty": "Handlekurven er tom.",
    "checkout.summary": "Oppsummering",
    "checkout.remove": "Fjern",
    "currency.nok": "kr",
    "currency.eur": "€",
    "footer.rights": "© 2026 Emilie. Alle rettigheter forbeholdt.",
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
