import type { Metadata } from "next"
import { getShopWorks } from "@/sanity/lib/fetch"
import ShopPageClient from "@/components/ShopPageClient"

export const metadata: Metadata = {
  title: "Galleri — Emilie",
  description: "Kunst til salgs",
}

export default async function ShopPage() {
  const products = await getShopWorks()
  return <ShopPageClient products={products} />
}
