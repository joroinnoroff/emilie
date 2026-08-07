"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"

type ContactProps = {
  settings: SiteSettings
}

const REASONS = [
  { value: "general", en: "General inquiry", nb: "Generell henvendelse" },
  { value: "commission", en: "Commission", nb: "Kommisjon" },
  { value: "purchase", en: "Purchase", nb: "Kjøp" },
  { value: "exhibition", en: "Exhibition / collaboration", nb: "Utstilling / samarbeid" },
  { value: "other", en: "Other", nb: "Annet" },
] as const

type ReasonValue = (typeof REASONS)[number]["value"]

function isReason(value: string | null): value is ReasonValue {
  return REASONS.some((r) => r.value === value)
}

export default function Contact({ settings }: ContactProps) {
  const { locale } = useLocale()
  const searchParams = useSearchParams()
  const email = settings.email || "post@emilie.no"
  const instagram = settings.instagram || "#"
  const intro = localized(locale, settings.contactIntro, settings.contactIntroNb)
  const [reason, setReason] = useState<ReasonValue>("general")

  useEffect(() => {
    const fromQuery = searchParams.get("reason")
    if (isReason(fromQuery)) setReason(fromQuery)
  }, [searchParams])

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
          <input
            type="text"
            name="name"
            placeholder={locale === "nb" ? "Navn" : "Name"}
          />
          <input type="email" name="email" placeholder="Email" />
          <label className="contact-reason">
            <span>{locale === "nb" ? "Årsak" : "Reason"}</span>
            <select
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReasonValue)}
            >
              {REASONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {locale === "nb" ? option.nb : option.en}
                </option>
              ))}
            </select>
          </label>
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
