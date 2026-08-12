"use client"

import { useLocale } from "@/lib/LocaleProvider"

export default function CheckoutHeading() {
  const { t } = useLocale()
  return (
    <h1 className="mb-10 text-[clamp(1.85rem,3.2vw,2.85rem)] tracking-tight">
      {t("checkout.title")}
    </h1>
  )
}
