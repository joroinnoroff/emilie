import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getShopWorks, getWorkBySlug } from "@/sanity/lib/fetch"
import ProductDetailView from "@/components/ProductDetailView"

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
  return { title: product ? `${product.title} — Emilie` : "Emilie" }
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getWorkBySlug(id)
  if (!product) return notFound()

  return <ProductDetailView product={product} />
}
