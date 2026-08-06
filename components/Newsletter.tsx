"use client"

import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"

type NewsletterProps = {
  settings: SiteSettings
}

export default function Newsletter({ settings }: NewsletterProps) {
  const { locale } = useLocale()
  const intro = localized(locale, settings.newsletterIntro, settings.newsletterIntroNb)

  return (
    <section className="newsletter" id="newsletter">
      <div className="wrap">
        <div className="newsletter-copy">
          <h2>{locale === "nb" ? "Nyhetsbrev" : "Newsletter"}</h2>
          <p>{intro}</p>
        </div>
        <form className="newsletter-form">
          <div className="newsletter-row">
            <input
              type="email"
              name="newsletter"
              placeholder={locale === "nb" ? "Din e-post" : "Your email"}
              required
            />
            <button type="submit" className="btn">
              {locale === "nb" ? "Abonner" : "Subscribe"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
