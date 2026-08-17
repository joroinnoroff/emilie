import type { Metadata } from "next"
import { getShopWorks } from "@/sanity/lib/fetch"
import ShopPageClient from "@/components/ShopPageClient"

export const metadata: Metadata = {
  title: "Galleri — Emilie",
  description:
    "Originale oljemalerier til salgs av Emilie W. Lien — norsk kunstner basert i Oslo.",
  keywords: [
    "Emilie W. Lien galleri",
    "Emilie W Lien kunst til salgs",
    "kjøp kunst Oslo",
    "kjøp oljemaleri Norge",
    "norsk kunstner Oslo",
    "originale malerier",
  ],
}

export default async function ShopPage() {
  const products = await getShopWorks()
  return <ShopPageClient products={products} />
}
