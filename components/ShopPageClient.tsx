"use client"

import { Suspense } from "react"
import ProductFilter from "@/components/ProductFilter"
import ShopLoader from "@/components/ShopLoader"
import { useLocale } from "@/lib/LocaleProvider"
import type { Project } from "@/lib/projects"
import { Wrap } from "./ui"

export default function ShopPageClient({ products }: { products: Project[] }) {
  const { t } = useLocale()

  if (products.length === 0) {
    return (
      <section className="pt-[220px] pb-[50px]">
        <Wrap>
          <h1 className="text-[clamp(1.85rem,3.2vw,2.85rem)] tracking-tight">
            {t("shop.empty")}
          </h1>
        </Wrap>
      </section>
    )
  }

  return (
    <section className="overflow-x-clip pt-[220px] pb-[50px]">
      <Wrap>
        <Suspense fallback={<ShopLoader label={t("shop.loading")} className="flex min-h-[30vh] w-full items-center justify-center" />}>
          <ProductFilter products={products} />
        </Suspense>
      </Wrap>
    </section>
  )
}
