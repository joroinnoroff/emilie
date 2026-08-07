"use client"

import Link from "next/link"
import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"

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
    <section className="commission" id="commission">
      <div className="wrap">
        <h2>{heading}</h2>
        <div className="commission-body">
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <Link href="/?reason=commission#contact" className="btn commission-cta">
          {cta}
        </Link>
      </div>
    </section>
  )
}
