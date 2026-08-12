"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "@/lib/LocaleProvider"
import { cn } from "./ui"

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

const fieldSm =
  "w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-2 font-inherit text-sm text-ink outline-none placeholder:text-ink-soft"

const chipClass =
  "inline-flex cursor-pointer items-center border-0 px-3 py-2 font-inherit text-[0.8125rem] text-ink transition-colors duration-300 ease-out"

const btnSm =
  "inline-flex cursor-pointer items-center gap-2 border border-ink bg-transparent px-5 py-2.5 font-inherit text-sm text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-45"

type UploadedAttachment = {
  url: string
  originalFilename: string
}

export default function ContactForm() {
  const { locale } = useLocale()
  const searchParams = useSearchParams()
  const fileInputId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [reason, setReason] = useState<ReasonValue>("general")
  const [fileName, setFileName] = useState<string | null>(null)
  const [attachment, setAttachment] = useState<UploadedAttachment | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const fromQuery = searchParams.get("reason")
    if (isReason(fromQuery)) setReason(fromQuery)
  }, [searchParams])

  const onFileChange = async (file: File | null) => {
    setUploadError(null)
    setAttachment(null)
    setFileName(file?.name ?? null)
    if (!file) return

    setUploading(true)
    try {
      const body = new FormData()
      body.append("file", file)
      const res = await fetch("/api/contact/attachment", {
        method: "POST",
        body,
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        url?: string
        originalFilename?: string
      }
      if (!res.ok || !data.url) {
        setUploadError(
          data.error ||
            (locale === "nb"
              ? "Kunne ikke laste opp vedlegget."
              : "Could not upload the attachment.")
        )
        setFileName(null)
        if (fileRef.current) fileRef.current.value = ""
        return
      }
      setAttachment({
        url: data.url,
        originalFilename: data.originalFilename || file.name,
      })
    } catch {
      setUploadError(
        locale === "nb"
          ? "Kunne ikke laste opp vedlegget."
          : "Could not upload the attachment."
      )
      setFileName(null)
      if (fileRef.current) fileRef.current.value = ""
    } finally {
      setUploading(false)
    }
  }

  return (
    <form
      id="contact"
      className="flex scroll-mt-28 flex-col gap-3.5 px-1 min-[861px]:px-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <h3 className="mb-0.5 text-xl tracking-tight">
        {locale === "nb" ? "Ta kontakt" : "Get in touch"}
      </h3>
      <input
        type="text"
        name="name"
        placeholder={locale === "nb" ? "Navn" : "Name"}
        className={fieldSm}
      />
      <input
        type="email"
        name="email"
        placeholder={locale === "nb" ? "E-post" : "Email"}
        className={fieldSm}
      />

      <div className="flex flex-col gap-1.5 text-[0.8125rem] text-ink-soft">
        <span>{locale === "nb" ? "Årsak" : "Reason"}</span>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label={locale === "nb" ? "Årsak" : "Reason"}
        >
          {REASONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={reason === option.value}
              className={cn(
                chipClass,
                "rounded-sm",
                reason === option.value ? "bg-[#e2e2de]" : "bg-[#f3f3f1]"
              )}
              onClick={() => setReason(option.value)}
            >
              {locale === "nb" ? option.nb : option.en}
            </button>
          ))}
        </div>
        <input type="hidden" name="reason" value={reason} />
      </div>

      <textarea
        name="message"
        rows={4}
        placeholder={locale === "nb" ? "Melding" : "Message"}
        className={`${fieldSm} min-h-[96px] resize-none`}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-[0.8125rem] text-ink-soft">
          {locale === "nb"
            ? "Ønsker du å laste opp vedlegg?"
            : "Want to upload an attachment?"}
        </span>
        <label
          htmlFor={fileInputId}
          className={cn(
            "inline-flex w-fit max-w-full cursor-pointer flex-col items-start justify-center gap-1 rounded-sm border border-dotted border-ink/35 bg-transparent px-3.5 py-3.5 text-sm text-ink transition-colors hover:border-ink/60 hover:bg-[#f3f3f1]/40",
            uploading && "pointer-events-none opacity-60",
            attachment && "border-ink/50 bg-[#f3f3f1]/50"
          )}
        >
          <span>
            {uploading
              ? locale === "nb"
                ? "Laster opp…"
                : "Uploading…"
              : fileName
                ? fileName
                : locale === "nb"
                  ? "Velg bilde eller PDF"
                  : "Choose image or PDF"}
          </span>
          {!fileName && !uploading ? (
            <span className="text-[0.8125rem] text-ink-soft">
              JPEG, PNG, WebP, GIF eller PDF · max 8 MB
            </span>
          ) : null}
        </label>
        <input
          ref={fileRef}
          id={fileInputId}
          type="file"
          name="attachment"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        {attachment ? (
          <input type="hidden" name="attachmentUrl" value={attachment.url} />
        ) : null}
        {uploadError ? (
          <p className="text-[0.8125rem] text-red-700">{uploadError}</p>
        ) : null}
        {attachment && !uploadError ? (
          <p className="text-[0.8125rem] text-ink-soft">
            {locale === "nb" ? "Vedlegg lastet opp." : "Attachment uploaded."}
          </p>
        ) : null}
      </div>

      <button type="submit" className={`${btnSm} mt-1 self-start`} disabled={uploading}>
        {locale === "nb" ? "Send melding" : "Send message"}
      </button>
    </form>
  )
}
