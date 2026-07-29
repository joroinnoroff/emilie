"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Project } from "@/lib/projects"
import { useCart } from "@/components/CartProvider"
import { demoCompleteCheckout } from "@/app/actions/checkout"

type CheckoutClientProps = {
  products: Project[]
}

export default function CheckoutClient({ products }: CheckoutClientProps) {
  const { lines, clearCart, removeItem } = useCart()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const detailed = useMemo(
    () =>
      lines
        .map((line) => {
          const product = products.find((p) => p.id === line.id)
          if (!product) return null
          return { line, product }
        })
        .filter(Boolean) as { line: { id: string; qty: number }; product: Project }[],
    [lines, products]
  )

  const totalNok = detailed.reduce(
    (sum, { line, product }) => sum + (product.priceNok ?? 0) * line.qty,
    0
  )
  const totalEur = detailed.reduce(
    (sum, { line, product }) => sum + (product.priceEur ?? 0) * line.qty,
    0
  )

  const pay = (method: "vipps" | "stripe") => {
    setError(null)
    startTransition(async () => {
      const result = await demoCompleteCheckout(detailed.map((d) => d.product.id))
      if (!result.ok) {
        setError(result.error)
        return
      }
      clearCart()
      const params = new URLSearchParams({
        method,
        sold: result.soldIds.join(","),
        write: result.writeEnabled ? "1" : "0",
      })
      router.push(`/checkout/success?${params.toString()}`)
    })
  }

  if (detailed.length === 0) {
    return (
      <div className="checkout-empty">
        <p>Your cart is empty.</p>
        <Link href="/#shop" className="btn">
          Browse shop
        </Link>
      </div>
    )
  }

  return (
    <div className="checkout-grid">
      <div className="checkout-lines">
        {detailed.map(({ line, product }) => (
          <article key={product.id} className="checkout-line">
            <div className="checkout-line-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.title} />
            </div>
            <div>
              <h2>{product.title}</h2>
              <p>
                {product.series} — {product.year}
              </p>
              <p>
                {product.priceNok != null
                  ? `${product.priceNok.toLocaleString("nb-NO")} kr`
                  : null}
                {product.priceNok != null && product.priceEur != null ? " · " : null}
                {product.priceEur != null
                  ? `€${product.priceEur.toLocaleString("nb-NO")}`
                  : product.price}
              </p>
              {product.stock > 1 ? <p>Qty {line.qty}</p> : <p>Unique original</p>}
              <button type="button" className="work-info-btn" onClick={() => removeItem(product.id)}>
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className="checkout-summary">
        <h2>Summary</h2>
        {totalNok > 0 ? (
          <p>
            <strong>{totalNok.toLocaleString("nb-NO")} kr</strong>
            <span> — Vipps (NOK)</span>
          </p>
        ) : null}
        {totalEur > 0 ? (
          <p>
            <strong>€{totalEur.toLocaleString("nb-NO")}</strong>
            <span> — Card (EUR)</span>
          </p>
        ) : null}
        {!totalNok && !totalEur ? (
          <p>Add numeric NOK/EUR prices in Sanity for totals.</p>
        ) : null}

        <p className="cart-note">
          Demo checkout — no real payment. Later these buttons will open Vipps / Stripe.
        </p>

        {error ? <p className="checkout-error">{error}</p> : null}

        <button
          type="button"
          className="btn"
          disabled={pending}
          onClick={() => pay("vipps")}
        >
          {pending ? "Processing…" : "Pay with Vipps (demo)"}
        </button>
        <button
          type="button"
          className="btn outline"
          disabled={pending}
          onClick={() => pay("stripe")}
          style={{ marginTop: 12 }}
        >
          {pending ? "Processing…" : "Pay with card (demo)"}
        </button>
      </aside>
    </div>
  )
}
