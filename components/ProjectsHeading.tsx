"use client"

import { useLocale } from "@/lib/LocaleProvider"

export default function ProjectsHeading() {
  const { t } = useLocale()
  return (
    <h1 className="text-[clamp(2.25rem,5vw,4rem)] tracking-tight">
      {t("projects.heading")}
    </h1>
  )
}
