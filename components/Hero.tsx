"use client"

import Link from "next/link"
import InfinityBanner from "./InfinityBanner"
import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"

type HeroProps = {
  settings: SiteSettings
}

export default function Hero({ settings }: HeroProps) {
  const { locale } = useLocale()
  const videoSrc = settings.heroVideoUrl || "/hero.mp4"

  const statement = localized(locale, settings.heroStatement, settings.heroStatementNb)
  const cta = localized(locale, settings.heroCtaLabel, settings.heroCtaLabelNb) || "See Works →"
  const basedIn = localized(locale, settings.basedIn, settings.basedInNb)
  const bornIn = localized(locale, settings.bornIn, settings.bornInNb)
  const banner = localized(locale, settings.exhibitionBanner, settings.exhibitionBannerNb)

  return (
    <section className="hero" id="hero">
      <div className="hero-above">
        {banner ? <InfinityBanner text={banner} /> : null}
        <div className="hero-top">
          <div className="wrap hero-content">
            <h1 className="hero-statement">{statement}</h1>
            <Link href="/#works" className="hero-link">
              {cta}
            </Link>
          </div>
        </div>
        <div className="hero-meta">
          <span>{basedIn}</span>
          <span>{bornIn}</span>
        </div>
      </div>
      <div className="hero-media" id="hero-media">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src={videoSrc} autoPlay muted loop playsInline />
      </div>
    </section>
  )
}
