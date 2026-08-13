"use client"

import { usePathname } from "next/navigation"
import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap, fieldClass, textLinkClass } from "./ui"

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type FooterProps = {
  settings: SiteSettings
}

export default function Footer({ settings }: FooterProps) {
  const pathname = usePathname()
  const { locale, t } = useLocale()
  const email = settings.email || "post@emilie.no"
  const instagram = settings.instagram || "#"
  const intro = localized(
    locale,
    settings.newsletterIntro,
    settings.newsletterIntroNb
  )
  const hideNewsletter =
    pathname === "/" ||
    pathname.startsWith("/checkout") ||
    /^\/shop\/[^/]+/.test(pathname)

  return (
    <footer
      className="border-t border-line pb-7"
      id={hideNewsletter ? undefined : "newsletter"}
    >
      <Wrap
        className={
          hideNewsletter
            ? "py-7"
            : "py-14 max-[860px]:py-12"
        }
      >
        {!hideNewsletter ? (
          <div className="mb-12 grid grid-cols-1 items-end gap-10 md:grid-cols-2 max-[860px]:mb-10 max-[860px]:gap-8">
            <div>
              <h2 className="mb-3 text-[clamp(1.5rem,2.4vw,2rem)] tracking-tight">
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
          </div>
        ) : null}

        <div
          className={
            hideNewsletter
              ? "flex flex-col gap-4 text-xs text-ink-soft lg:flex-row lg:items-end lg:justify-between lg:gap-6"
              : "flex flex-col gap-4 border-t border-line pt-7 text-xs text-ink-soft lg:flex-row lg:items-end lg:justify-between lg:gap-6"
          }
        >
          <div className="flex items-center gap-4 lg:order-2">
            <a
              href={`mailto:${email}`}
              className="inline-flex transition-colors duration-300 hover:text-ink"
              aria-label={email}
            >
              <MailIcon />
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex transition-colors duration-300 hover:text-ink"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
          <div className="flex w-full items-baseline justify-between gap-4 lg:contents">
            <span className="lg:order-1">{t("footer.rights")}</span>
            <span className="text-[0.55rem] lg:order-3">Made by Oino</span>
          </div>
        </div>
      </Wrap>
    </footer>
  )
}
