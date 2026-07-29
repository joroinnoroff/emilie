import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order confirmed — Emilie",
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string; sold?: string; write?: string }>
}) {
  const params = await searchParams
  const method = params.method === "vipps" ? "Vipps" : "Card"
  const writeEnabled = params.write === "1"

  return (
    <section className="page-hero">
      <div className="wrap checkout-success">
        <h1>Thank you</h1>
        <p>
          Demo {method} payment completed
          {params.sold ? ` for ${params.sold.split(",").filter(Boolean).length} work(s)` : ""}.
        </p>
        <p className="cart-note">
          {writeEnabled
            ? "Works were marked Sold in Sanity."
            : "Add SANITY_API_WRITE_TOKEN to .env to mark works Sold in Sanity. Cart was cleared locally."}
        </p>
        <Link href="/#shop" className="btn">
          Back to shop
        </Link>
      </div>
    </section>
  )
}
