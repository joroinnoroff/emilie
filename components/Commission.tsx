"use client"

import { Suspense } from "react"
import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"
import ContactForm from "./ContactForm"
import { Wrap } from "./ui"

type CommissionProps = {
  settings: SiteSettings
}

export default function Commission({ settings }: CommissionProps) {
  const { locale } = useLocale()
  const heading =
    localized(locale, settings.commissionHeading, settings.commissionHeadingNb) ||
    (locale === "nb" ? "Ønsker du et verk?" : "Looking for a Custom Artwork?")
  const body =
    locale === "nb"
      ? settings.commissionBodyNb?.length
        ? settings.commissionBodyNb
        : settings.commissionBody
      : settings.commissionBody?.length
        ? settings.commissionBody
        : settings.commissionBodyNb

  if (!body?.length) return null

  return (
    <section className="border-t border-line py-[100px]" id="commission">
      <Wrap className="grid w-full grid-cols-1 items-start gap-16 min-[861px]:grid-cols-2 max-[860px]:gap-10">
        <div>
          <h2 className="mb-7 max-w-[18ch] text-[clamp(1.85rem,3.2vw,2.85rem)] tracking-tight">
            {heading}
          </h2>
          <div className="flex max-w-[640px] flex-col gap-[18px]">
            {body.map((paragraph, i) => (
              <p key={i} className="text-[1.0625rem] text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-8 min-[861px]:sticky min-[861px]:top-[110px] min-[861px]:mt-10">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </Wrap>
    </section>
  )
}
