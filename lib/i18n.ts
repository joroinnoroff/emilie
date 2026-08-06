export type Locale = "en" | "nb"

const messages = {
  en: {
    "nav.works": "Works",
    "nav.about": "About",
    "nav.shop": "Shop",
    "nav.contact": "Contact",
    "nav.cart": "Cart",
    "shop.back": "Back to shop",
    "shop.original": "Original",
    "shop.print": "Print",
    "shop.selectVersion": "Version",
    "shop.selectSize": "Print size",
    "shop.addToCart": "Add to Cart",
    "shop.inCart": "In cart",
    "shop.sold": "Sold",
    "shop.unique": "Unique original",
    "checkout.title": "Checkout",
    "checkout.payStripe": "Pay with card",
    "checkout.processing": "Redirecting to Stripe…",
    "checkout.empty": "Your cart is empty.",
    "checkout.summary": "Summary",
    "checkout.remove": "Remove",
    "currency.nok": "kr",
    "currency.eur": "€",
  },
  nb: {
    "nav.works": "Arbeider",
    "nav.about": "Om",
    "nav.shop": "Butikk",
    "nav.contact": "Kontakt",
    "nav.cart": "Handlekurv",
    "shop.back": "Tilbake til butikk",
    "shop.original": "Original",
    "shop.print": "Trykk",
    "shop.selectVersion": "Versjon",
    "shop.selectSize": "Trykkstørrelse",
    "shop.addToCart": "Legg i handlekurv",
    "shop.inCart": "I handlekurven",
    "shop.sold": "Solgt",
    "shop.unique": "Unik original",
    "checkout.title": "Kasse",
    "checkout.payStripe": "Betal med kort",
    "checkout.processing": "Sender deg til Stripe…",
    "checkout.empty": "Handlekurven er tom.",
    "checkout.summary": "Oppsummering",
    "checkout.remove": "Fjern",
    "currency.nok": "kr",
    "currency.eur": "€",
  },
} as const

export type MessageKey = keyof typeof messages.en

export function t(locale: Locale, key: MessageKey): string {
  return messages[locale][key] ?? messages.en[key] ?? key
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
