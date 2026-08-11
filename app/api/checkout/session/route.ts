import { NextResponse } from "next/server"
import { getStripe, hasStripe } from "@/lib/stripe"

export async function GET(req: Request) {
  if (!hasStripe()) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 })
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    })

    const items =
      session.line_items?.data.map((item) => {
        const product = item.price?.product
        const name =
          typeof product === "object" && product && !product.deleted
            ? product.name
            : item.description || "Item"
        return {
          name,
          quantity: item.quantity || 1,
          amount: (item.amount_total || 0) / 100,
        }
      }) || []

    return NextResponse.json({
      orderId: session.id,
      paymentStatus: session.payment_status,
      status: session.status,
      email: session.customer_details?.email || session.customer_email,
      name:
        session.customer_details?.name ||
        session.metadata?.customerName ||
        "",
      currency: (session.currency || "nok").toUpperCase(),
      amountTotal: (session.amount_total || 0) / 100,
      delivery: session.metadata?.deliveryLabel || session.metadata?.delivery || "",
      pickupPoint: session.metadata?.pickupPointName || "",
      postalCode: session.metadata?.postalCode || "",
      items,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load order."
    return NextResponse.json({ error: message }, { status: 404 })
  }
}
