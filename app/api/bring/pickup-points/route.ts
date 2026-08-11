import { NextResponse } from "next/server"
import { fetchBringPickupPoints, hasBringConfig } from "@/lib/bring"

export async function GET(req: Request) {
  if (!hasBringConfig()) {
    return NextResponse.json(
      {
        error:
          "Bring is not configured. Set BRING_API_UID and BRING_API_KEY in .env",
        points: [],
      },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(req.url)
  const postalCode = (searchParams.get("postalCode") || "").trim()
  const street = searchParams.get("street") || undefined
  const streetNumber = searchParams.get("streetNumber") || undefined

  if (!/^\d{4}$/.test(postalCode)) {
    return NextResponse.json(
      { error: "Enter a valid 4-digit Norwegian postal code.", points: [] },
      { status: 400 }
    )
  }

  try {
    const points = await fetchBringPickupPoints({
      postalCode,
      street,
      streetNumber,
    })
    return NextResponse.json({ points })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bring error"
    return NextResponse.json({ error: message, points: [] }, { status: 502 })
  }
}
