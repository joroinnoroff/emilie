import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Suspense } from "react"
import { getShopWorks, getWorkBySlug } from "@/sanity/lib/fetch"
import FullscreenImage from "@/components/FullscreenImage"
import ProductPurchase from "@/components/ProductPurchase"
import Link from "next/link"

export async function generateStaticParams() {
  const products = await getShopWorks()
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getWorkBySlug(id)
  return { title: product ? `${product.title} — Shop — Emilie` : "Shop — Emilie" }
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getWorkBySlug(id)
  if (!product) return notFound()

  return (
    <section className="detail-hero">
      <div className="arrowback back-link mb-4 wrap hover:underline hover:opacity-80 transition-all duration-300 mx-auto">
        <Link href="/shop">Back to shop</Link>
      </div>

      <div className="wrap">
        <FullscreenImage src={product.image} alt={product.title} />
        <div className="detail-meta">
          <div className="detail-eyebrow">
            {product.medium} — {product.year}
          </div>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <div className="detail-specs">
            <div>
              <span>Medium</span>
              <span>{product.medium}</span>
            </div>
            <div>
              <span>Original size</span>
              <span>{product.size || "—"}</span>
            </div>
            <div>
              <span>Status</span>
              <span>{product.status}</span>
            </div>
            {product.printAvailable ? (
              <div>
                <span>Prints</span>
                <span>
                  {product.prints.filter((p) => p.stock > 0).length
                    ? `${product.prints.filter((p) => p.stock > 0).length} size(s)`
                    : "Unavailable"}
                </span>
              </div>
            ) : null}
          </div>

          <div className="cart-block mb-32">
            <Suspense fallback={<p className="cart-note">Loading…</p>}>
              <ProductPurchase product={product} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
