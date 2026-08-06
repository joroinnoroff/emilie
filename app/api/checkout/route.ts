import { NextResponse } from "next/server"
import { getStripe, hasStripe } from "@/lib/stripe"
import type Stripe from "stripe"

type CheckoutLine = {
  id: string
  productId: string
  variant: "original" | "print"
  printSize?: string
  qty: number
  title: string
  priceNok?: number
  priceEur?: number
}

type DeliveryPayload = {
  key: string
  label: string
  priceNok: number
  priceEur: number
}

export async function POST(req: Request) {
  if (!hasStripe()) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    )
  }

  const body = (await req.json()) as {
    locale?: string
    currency?: "eur" | "nok"
    email?: string
    name?: string
    lines?: CheckoutLine[]
    delivery?: DeliveryPayload
  }

  const lines = body.lines || []
  const currency = body.currency === "nok" ? "nok" : "eur"
  const email = (body.email || "").trim()

  if (!lines.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 })
  }
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }
  if (!body.delivery?.key) {
    return NextResponse.json({ error: "Choose a delivery option." }, { status: 400 })
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"

  const stripeLines: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  for (const line of lines) {
    const unit = currency === "nok" ? line.priceNok : line.priceEur
    if (unit == null || unit <= 0) continue
    const label =
      line.variant === "print"
        ? `${line.title} (Print · ${line.printSize})`
        : `${line.title} (Original)`
    stripeLines.push({
      quantity: line.qty,
      price_data: {
        currency,
        unit_amount: Math.round(unit * 100),
        product_data: {
          name: label,
          metadata: {
            productId: line.productId,
            variant: line.variant,
            printSize: line.printSize || "",
            lineId: line.id,
          },
        },
      },
    })
  }

  const deliveryAmount =
    currency === "nok" ? body.delivery.priceNok : body.delivery.priceEur

  stripeLines.push({
    quantity: 1,
    price_data: {
      currency,
      unit_amount: Math.round(Math.max(0, deliveryAmount) * 100),
      product_data: {
        name: `Delivery — ${body.delivery.label}`,
        metadata: {
          productId: "delivery",
          variant: "delivery",
          printSize: "",
          lineId: `delivery:${body.delivery.key}`,
        },
      },
    },
  })

  if (stripeLines.length <= 1 && deliveryAmount === 0 && lines.length > 0) {
    // Only delivery free line — products missing currency prices
    const hasProduct = stripeLines.some(
      (l) => l.price_data?.product_data?.metadata?.productId !== "delivery"
    )
    if (!hasProduct) {
      return NextResponse.json(
        {
          error:
            currency === "nok"
              ? "Add NOK prices in Sanity for Norwegian checkout."
              : "Add EUR prices in Sanity for English checkout.",
        },
        { status: 400 }
      )
    }
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      line_items: stripeLines,
      customer_email: email,
      return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        locale: body.locale || "en",
        currency,
        customerName: body.name || "",
        delivery: body.delivery.key,
        deliveryLabel: body.delivery.label,
      },
    })

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Stripe did not return a client secret." },
        { status: 500 }
      )
    }

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
