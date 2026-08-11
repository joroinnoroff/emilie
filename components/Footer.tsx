"use client"

import { useLocale } from "@/lib/LocaleProvider"
import { Wrap } from "./ui"

export default function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t border-line py-7">
      <Wrap className="flex justify-between text-xs text-ink-soft">
        <span>{t("footer.rights")}</span>
        <span>Made by Oino</span>
      </Wrap>
    </footer>
  )
}
