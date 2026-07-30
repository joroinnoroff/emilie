import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getShopWorks, getWorkBySlug } from "@/sanity/lib/fetch"
import AddToCartButton from "@/components/AddToCartButton"
import FullscreenImage from "@/components/FullscreenImage"
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
          <div className="detail-eyebrow">Original Painting — {product.year}</div>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <div className="detail-specs">
            <div>
              <span>Medium</span>
              <span>{product.medium}</span>
            </div>
            <div>
              <span>Size</span>
              <span>{product.size}</span>
            </div>
            <div>
              <span>Status</span>
              <span>{product.status}</span>
            </div>
            {product.priceNok != null ? (
              <div>
                <span>NOK</span>
                <span>{product.priceNok.toLocaleString("nb-NO")} kr</span>
              </div>
            ) : null}
            {product.priceEur != null ? (
              <div>
                <span>EUR</span>
                <span>€{product.priceEur.toLocaleString("nb-NO")}</span>
              </div>
            ) : null}
          </div>

          <div className="cart-block mb-32">
            <div className="cart-price">{product.price}</div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </section>
  )
}
