import ProductFilter from "@/components/ProductFilter"
import { getWorks } from "@/sanity/lib/fetch"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop — Emilie",
  description: "All art for sale",
}

export default async function ShopPage() {
  const products = await getWorks()

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
        <ProductFilter products={products} />
      </div>
    </section>
  )
}
