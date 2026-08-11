"use client"

import Link from "next/link"
import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap, textLinkClass } from "./ui"

type CommissionProps = {
  settings: SiteSettings
}

export default function Commission({ settings }: CommissionProps) {
  const { locale } = useLocale()
  const heading =
    localized(locale, settings.commissionHeading, settings.commissionHeadingNb) ||
    (locale === "nb" ? "Ønsker du et verk?" : "Looking for a Custom Artwork?")
  const cta =
    localized(locale, settings.commissionCta, settings.commissionCtaNb) ||
    (locale === "nb" ? "Kontakt" : "Contact")
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
      <Wrap>
        <h2 className="mb-7 max-w-[18ch] text-[clamp(2.25rem,4.2vw,3.5rem)] tracking-tight">
          {heading}
        </h2>
        <div className="mb-8 flex max-w-[640px] flex-col gap-[18px]">
          {body.map((paragraph, i) => (
            <p key={i} className="text-[1.0625rem] text-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>
        <Link href="/?reason=commission#contact" className={textLinkClass}>
          {cta}
        </Link>
      </Wrap>
    </section>
  )
}
