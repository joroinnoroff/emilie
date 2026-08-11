import { NextResponse } from "next/server"
import { fetchBringShippingOptions, hasBringConfig } from "@/lib/bring"

export async function POST(req: Request) {
  if (!hasBringConfig()) {
    return NextResponse.json(
      {
        error:
          "Bring is not configured. Set BRING_API_UID and BRING_API_KEY in .env",
        options: [],
      },
      { status: 503 }
    )
  }

  const body = (await req.json()) as {
    postalCode?: string
    countryCode?: string
    weightGrams?: number
    language?: "NO" | "EN"
  }

  const postalCode = (body.postalCode || "").trim()
  if (!/^\d{4}$/.test(postalCode)) {
    return NextResponse.json(
      { error: "Enter a valid 4-digit Norwegian postal code.", options: [] },
      { status: 400 }
    )
  }

  try {
    const options = await fetchBringShippingOptions({
      toPostalCode: postalCode,
      toCountryCode: body.countryCode || "NO",
      weightGrams: body.weightGrams,
      language: body.language || "NO",
    })
    return NextResponse.json({ options })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bring error"
    return NextResponse.json({ error: message, options: [] }, { status: 502 })
  }
}
