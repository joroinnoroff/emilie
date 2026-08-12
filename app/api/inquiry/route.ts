import { NextResponse } from "next/server"
import { Resend } from "resend"

type InquiryLine = {
  id: string
  productId: string
  title: string
  variant: "original" | "print"
  printSize?: string
  qty: number
  priceNok?: number
  priceEur?: number
}

type InquiryBody = {
  name?: string
  email?: string
  phone?: string
  message?: string
  shippingLocation?: string
  locale?: string
  lines?: InquiryLine[]
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatLine(line: InquiryLine) {
  const version =
    line.variant === "original"
      ? "Original"
      : `Print · ${line.printSize || "—"}`
  const priceBits = [
    line.priceNok != null ? `${line.priceNok} NOK` : null,
    line.priceEur != null ? `${line.priceEur} EUR` : null,
  ].filter(Boolean)
  return `${line.title} — ${version} × ${line.qty}${
    priceBits.length ? ` (${priceBits.join(" / ")})` : ""
  }`
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email is not configured." },
      { status: 500 }
    )
  }

  let body: InquiryBody
  try {
    body = (await req.json()) as InquiryBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 })
  }

  const name = (body.name || "").trim()
  const email = (body.email || "").trim()
  const phone = (body.phone || "").trim()
  const message = (body.message || "").trim()
  const shippingLocation = (body.shippingLocation || "").trim()
  const lines = Array.isArray(body.lines) ? body.lines : []

  if (!name || !email || !phone || !shippingLocation || !lines.length) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 })
  }

  const to =
    process.env.INQUIRY_TO_EMAIL ||
    process.env.CONTACT_EMAIL ||
    "post@emilie.no"
  const from =
    process.env.RESEND_FROM_EMAIL || "Emilie <onboarding@resend.dev>"

  const lineText = lines.map((l) => `• ${formatLine(l)}`).join("\n")
  const lineHtml = lines
    .map((l) => `<li>${escapeHtml(formatLine(l))}</li>`)
    .join("")

  const text = [
    "New artwork inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Shipping location: ${shippingLocation}`,
    "",
    "Selected works:",
    lineText,
    "",
    "Message:",
    message || "(none)",
  ].join("\n")

  const html = `
    <h2>New artwork inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
    <strong>Email:</strong> ${escapeHtml(email)}<br/>
    <strong>Phone:</strong> ${escapeHtml(phone)}<br/>
    <strong>Shipping location:</strong> ${escapeHtml(shippingLocation)}</p>
    <h3>Selected works</h3>
    <ul>${lineHtml}</ul>
    <h3>Message</h3>
    <p>${escapeHtml(message || "(none)").replace(/\n/g, "<br/>")}</p>
  `

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Forespørsel: ${name} (${lines.length} verk)`,
      text,
      html,
    })

    if (error) {
      console.error("Resend inquiry error:", error)
      return NextResponse.json(
        { error: "Could not send inquiry." },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Inquiry send failed:", err)
    return NextResponse.json(
      { error: "Could not send inquiry." },
      { status: 502 }
    )
  }
}
