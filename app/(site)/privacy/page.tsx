import type { Metadata } from "next"
import LegalContent from "@/components/LegalContent"
import { getSiteSettings } from "@/sanity/lib/fetch"

export const metadata: Metadata = {
  title: "Privacy & Terms — Emilie",
  description: "Privacy, cookies, and terms.",
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings()
  return <LegalContent email={settings.email || "post@emilie.no"} />
}
