"use client"

import { Suspense } from "react"
import ProductFilter from "@/components/ProductFilter"
import { useLocale } from "@/lib/LocaleProvider"
import type { Project } from "@/lib/projects"
import { Wrap } from "./ui"

export default function ShopPageClient({ products }: { products: Project[] }) {
  const { t } = useLocale()

  if (products.length === 0) {
    return (
      <section className="pt-[150px] pb-[50px]">
        <Wrap>
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] tracking-tight">
            {t("shop.empty")}
          </h1>
        </Wrap>
      </section>
    )
  }

  return (
    <section className="overflow-x-clip pt-[150px] pb-[50px]">
      <Wrap>
        <Suspense fallback={<p>{t("shop.loading")}</p>}>
          <ProductFilter products={products} />
        </Suspense>
      </Wrap>
    </section>
  )
}
