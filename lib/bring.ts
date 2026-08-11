/**
 * Bring Shipping Guide + Pickup Point helpers.
 * Docs: https://developer.bring.com/api/testing/
 * Auth: X-Mybring-API-Uid + X-Mybring-API-Key + X-Bring-Client-URL
 */

export const BRING_PRODUCT_HOME = "5600" // Pakke hjem / Parcel home plus
export const BRING_PRODUCT_PICKUP = "5800" // Pakke til hentested / Pickup parcel

export type BringShippingOption = {
  key: "bring_home" | "bring_pickup"
  productId: string
  label: string
  labelNb: string
  description?: string
  priceNok: number
  priceEur: number
  currencyCode: string
  expectedDelivery?: string
}

export type BringPickupPoint = {
  id: string
  name: string
  address: string
  postalCode: string
  city: string
  distanceInKm?: string
  openingHours?: string
}

type BringPriceBlock = {
  listPrice?: {
    priceWithAdditionalServices?: { amountWithVAT?: string }
    priceWithoutAdditionalServices?: { amountWithVAT?: string }
    currencyCode?: string
  }
  netPrice?: {
    priceWithAdditionalServices?: { amountWithVAT?: string }
    priceWithoutAdditionalServices?: { amountWithVAT?: string }
    currencyCode?: string
  }
}

type BringProduct = {
  id?: string
  productionCode?: string
  guiInformation?: {
    displayName?: string
    productName?: string
    descriptionText?: string
    shortName?: string
  }
  price?: BringPriceBlock
  expectedDelivery?: {
    workingDays?: string
    formattedExpectedDeliveryDate?: string
  }
  errors?: unknown[]
}

function bringHeaders(): HeadersInit | null {
  const uid = process.env.BRING_API_UID?.trim()
  const key = process.env.BRING_API_KEY?.trim()
  if (!uid || !key) return null
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Mybring-API-Uid": uid,
    "X-Mybring-API-Key": key,
    "X-Bring-Client-URL":
      process.env.BRING_CLIENT_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000",
  }
}

export function hasBringConfig() {
  return Boolean(process.env.BRING_API_UID?.trim() && process.env.BRING_API_KEY?.trim())
}

function nokToEur(nok: number) {
  const rate = Number(process.env.BRING_NOK_TO_EUR || "0.085")
  return Math.round(nok * rate * 100) / 100
}

function parseAmount(price?: BringPriceBlock): { nok: number; currency: string } | null {
  if (!price) return null
  const block = price.netPrice || price.listPrice
  if (!block) return null
  const raw =
    block.priceWithAdditionalServices?.amountWithVAT ||
    block.priceWithoutAdditionalServices?.amountWithVAT
  if (!raw) return null
  const nok = Number.parseFloat(raw)
  if (!Number.isFinite(nok)) return null
  return { nok, currency: block.currencyCode || "NOK" }
}

function shippingDateParts() {
  const d = new Date()
  // Prefer next weekday morning for lead times
  d.setDate(d.getDate() + 1)
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    day: String(d.getDate()).padStart(2, "0"),
    hour: "10",
    minute: "00",
  }
}

export async function fetchBringShippingOptions(input: {
  toPostalCode: string
  toCountryCode?: string
  weightGrams?: number
  language?: "NO" | "EN"
}): Promise<BringShippingOption[]> {
  const headers = bringHeaders()
  if (!headers) return []

  const customerNumber = process.env.BRING_CUSTOMER_NUMBER || "5"
  const fromPostalCode = process.env.BRING_FROM_POSTAL_CODE || "0150"
  const toPostalCode = input.toPostalCode.replace(/\s/g, "")
  const weight = Math.max(500, input.weightGrams ?? 2500)

  const body = {
    withPrice: true,
    withExpectedDelivery: true,
    withGuiInformation: true,
    edi: true,
    language: input.language || "NO",
    consignments: [
      {
        id: "1",
        fromCountryCode: "NO",
        toCountryCode: input.toCountryCode || "NO",
        fromPostalCode,
        toPostalCode,
        shippingDate: shippingDateParts(),
        packages: [
          {
            id: "1",
            grossWeight: weight,
            length: 60,
            width: 50,
            height: 8,
          },
        ],
        products: [
          { id: BRING_PRODUCT_HOME, customerNumber },
          { id: BRING_PRODUCT_PICKUP, customerNumber },
        ],
      },
    ],
  }

  const res = await fetch("https://api.bring.com/shippingguide/api/v2/products", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Bring Shipping Guide ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = (await res.json()) as {
    consignments?: { products?: BringProduct[] }[]
  }

  const products = data.consignments?.[0]?.products || []
  const options: BringShippingOption[] = []

  for (const product of products) {
    if (!product.id || (product.errors && product.errors.length)) continue
    const amount = parseAmount(product.price)
    if (!amount) continue

    const gui = product.guiInformation
    if (product.id === BRING_PRODUCT_HOME || product.productionCode === BRING_PRODUCT_HOME) {
      options.push({
        key: "bring_home",
        productId: BRING_PRODUCT_HOME,
        label: gui?.displayName || gui?.productName || "Home delivery",
        labelNb: gui?.displayName || gui?.productName || "Hjemlevering",
        description: gui?.descriptionText,
        priceNok: amount.nok,
        priceEur: nokToEur(amount.nok),
        currencyCode: amount.currency,
        expectedDelivery:
          product.expectedDelivery?.formattedExpectedDeliveryDate ||
          (product.expectedDelivery?.workingDays
            ? `${product.expectedDelivery.workingDays} dager`
            : undefined),
      })
    }
    if (product.id === BRING_PRODUCT_PICKUP || product.productionCode === "1202") {
      options.push({
        key: "bring_pickup",
        productId: BRING_PRODUCT_PICKUP,
        label: gui?.displayName || gui?.productName || "Pickup point",
        labelNb: gui?.displayName || gui?.productName || "Hentested",
        description: gui?.descriptionText,
        priceNok: amount.nok,
        priceEur: nokToEur(amount.nok),
        currencyCode: amount.currency,
        expectedDelivery:
          product.expectedDelivery?.formattedExpectedDeliveryDate ||
          (product.expectedDelivery?.workingDays
            ? `${product.expectedDelivery.workingDays} dager`
            : undefined),
      })
    }
  }

  return options
}

export async function fetchBringPickupPoints(input: {
  postalCode: string
  street?: string
  streetNumber?: string
}): Promise<BringPickupPoint[]> {
  const headers = bringHeaders()
  if (!headers) return []

  const postalCode = input.postalCode.replace(/\s/g, "")
  const params = new URLSearchParams()
  if (input.street) params.set("street", input.street)
  if (input.streetNumber) params.set("streetNumber", input.streetNumber)

  const qs = params.toString()
  const url = `https://api.bring.com/pickuppoint/api/pickuppoint/NO/postalCode/${encodeURIComponent(postalCode)}${qs ? `?${qs}` : ""}`

  const res = await fetch(url, {
    headers: { ...headers, Accept: "application/json" },
    cache: "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Bring Pickup Point ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = (await res.json()) as {
    pickupPoint?: Array<{
      id?: string
      name?: string
      address?: string
      postalCode?: string
      city?: string
      distanceInKm?: string
      openingHoursNorwegian?: string
      openingHoursEnglish?: string
    }>
  }

  return (data.pickupPoint || [])
    .filter((p) => p.id && p.name)
    .slice(0, 12)
    .map((p) => ({
      id: String(p.id),
      name: p.name || "",
      address: p.address || "",
      postalCode: p.postalCode || postalCode,
      city: p.city || "",
      distanceInKm: p.distanceInKm,
      openingHours: p.openingHoursNorwegian || p.openingHoursEnglish,
    }))
}
