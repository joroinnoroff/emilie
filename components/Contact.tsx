"use client"

import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"

type ContactProps = {
  settings: SiteSettings
}

export default function Contact({ settings }: ContactProps) {
  const { locale } = useLocale()
  const email = settings.email || "post@emilie.no"
  const instagram = settings.instagram || "#"
  const intro = localized(locale, settings.contactIntro, settings.contactIntroNb)

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="contact-intro">
          <h2>{locale === "nb" ? "Ta kontakt" : "Get in touch"}</h2>
          <p>{intro}</p>
          <div className="contact-links">
            <a href={`mailto:${email}`}>{email}</a>
            <a href={instagram} target="_blank" rel="noreferrer">
              Instagram →
            </a>
          </div>
        </div>
        <form className="contact-form">
          <input type="text" name="name" placeholder={locale === "nb" ? "Navn" : "Name"} />
          <input type="email" name="email" placeholder="Email" />
          <textarea
            name="message"
            rows={4}
            placeholder={locale === "nb" ? "Melding" : "Message"}
          />
          <button type="submit" className="btn">
            {locale === "nb" ? "Send melding" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  )
}
