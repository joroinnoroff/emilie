import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getShopSiblings, getShopWorks, getWorkBySlug } from "@/sanity/lib/fetch"
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
  if (!product) return { title: "Emilie" }

  // Root layout's title template already appends "· Emilie W. Lien" to `title`,
  // but openGraph/twitter titles don't use that template — they need the full form.
  const fullTitle = `${product.title} — Emilie W. Lien`
  const description = product.description
    ? product.description.slice(0, 200)
    : `${product.title} (${product.year}), ${product.medium} by Emilie W. Lien. ${product.size ? `${product.size}. ` : ""}Original oil painting by Norwegian artist Emilie W. Lien.`

  return {
    title: product.title,
    description,
    keywords: [
      product.title,
      "Emilie W. Lien",
      "Emilie W Lien",
      `${product.title} Emilie W. Lien`,
      "original oil painting",
      "norsk kunstner",
      product.series,
    ].filter(Boolean),
    openGraph: product.image
      ? {
          title: fullTitle,
          description,
          images: [{ url: product.image, alt: product.title }],
        }
      : undefined,
    twitter: {
      title: fullTitle,
      description,
    },
  }
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getWorkBySlug(id)
  if (!product) return notFound()

  const { prev, next } = await getShopSiblings(product.id)

  return <ProductDetailView product={product} prev={prev} next={next} />
}
