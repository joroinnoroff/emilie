import { Suspense } from "react"
import ProductFilter from "@/components/ProductFilter"
import { getShopWorks } from "@/sanity/lib/fetch"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop — Emilie",
  description: "All art for sale",
}

export default async function ShopPage() {
  const products = await getShopWorks()

  if (products.length === 0) {
    return (
      <section className="page-hero">
        <div className="wrap">
          <h1>No products found</h1>
        </div>
      </section>
    )
  }

  return (
    <section className="page-hero">
      <div className="wrap">
        <Suspense fallback={<p>Loading shop…</p>}>
          <ProductFilter products={products} />
        </Suspense>
      </div>
    </section>
  )
}
