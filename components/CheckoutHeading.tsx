"use client"

import { useLocale } from "@/lib/LocaleProvider"

export default function CheckoutHeading() {
  const { t } = useLocale()
  return (
    <h1 className="mb-10 text-[clamp(2.25rem,5vw,4rem)] tracking-tight">
      {t("checkout.title")}
    </h1>
  )
}
