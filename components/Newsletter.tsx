"use client"

import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap, fieldClass, textLinkClass } from "./ui"

type NewsletterProps = {
  settings: SiteSettings
}

export default function Newsletter({ settings }: NewsletterProps) {
  const { locale } = useLocale()
  const intro = localized(
    locale,
    settings.newsletterIntro,
    settings.newsletterIntroNb
  )

  return (
    <section className="border-t border-line py-20" id="newsletter">
      <Wrap className="grid grid-cols-1 items-end gap-12 md:grid-cols-2 max-[860px]:gap-10">
        <div>
          <h2 className="mb-3 text-[clamp(1.85rem,3.2vw,2.85rem)] tracking-tight">
            {locale === "nb" ? "Nyhetsbrev" : "Newsletter"}
          </h2>
          <p className="max-w-[360px] text-[1.0625rem] text-ink-soft">{intro}</p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-end gap-4 max-[860px]:flex-col max-[860px]:items-stretch">
            <input
              type="email"
              name="newsletter"
              placeholder={locale === "nb" ? "Din e-post" : "Your email"}
              required
              className={`${fieldClass} flex-1`}
            />
            <button type="submit" className={`${textLinkClass} shrink-0 py-2.5`}>
              {locale === "nb" ? "Abonner" : "Subscribe"}
            </button>
          </div>
        </form>
      </Wrap>
    </section>
  )
}
