"use client"

import { useLocale } from "@/lib/LocaleProvider"

export default function Money({
  priceNok,
  priceEur,
}: {
  priceNok?: number | null
  priceEur?: number | null
}) {
  const { money } = useLocale()
  return <>{money({ priceNok, priceEur })}</>
}
