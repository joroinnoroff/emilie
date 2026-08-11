"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import InfinityBanner from "./InfinityBanner"
import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap } from "./ui"

type HeroProps = {
  settings: SiteSettings
}

export default function Hero({ settings }: HeroProps) {
  const { locale } = useLocale()
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoSrc = settings.heroVideoUrl || "/hero.mp4"

  const statement = localized(locale, settings.heroStatement, settings.heroStatementNb)
  const cta =
    localized(locale, settings.heroCtaLabel, settings.heroCtaLabelNb) || "See Works →"
  const basedIn = localized(locale, settings.basedIn, settings.basedInNb)
  const bornIn = localized(locale, settings.bornIn, settings.bornInNb)
  const banner = localized(
    locale,
    settings.exhibitionBanner,
    settings.exhibitionBannerNb
  )

  useEffect(() => {
    const media = mediaRef.current
    const video = videoRef.current
    if (!media || !video) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = media.getBoundingClientRect()
      const viewH = window.innerHeight || 1
      // Parallax while the banner is in/near view
      const offset = rect.top + rect.height * 0.5 - viewH * 0.5
      const shift = Math.max(-80, Math.min(80, offset * -0.22))
      video.style.transform = `translate3d(0, ${shift}px, 0) scale(1.12)`
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <section
      className="relative flex min-h-screen flex-col justify-end p-0"
      id="hero"
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        {banner ? <InfinityBanner text={banner} /> : null}
        <div className="flex min-h-0 flex-1 items-stretch pt-28 pl-9 max-[860px]:pt-[5.5rem] max-[860px]:pl-[1.85rem]">
          <Wrap className="flex flex-1 flex-col justify-end gap-6 pb-10 max-[860px]:pb-8 max-[860px]:gap-6">
            <h1 className="max-w-[18ch] text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight max-[860px]:max-w-none">
              {statement}
            </h1>
            <Link
              href="/#works"
              className="w-fit border-b border-ink pb-0.5 text-base text-ink transition-opacity hover:opacity-55"
            >
              {cta}
            </Link>
          </Wrap>
        </div>
        <div className="flex justify-between gap-4 px-12 pb-3 pl-[calc(2.25rem+3rem)] text-sm text-ink-soft max-[860px]:px-6 max-[860px]:pl-[calc(1.85rem+1.5rem)] max-[860px]:pb-3">
          <span>{basedIn}</span>
          <span>{bornIn}</span>
        </div>
      </div>
      <div
        ref={mediaRef}
        className="relative w-full overflow-hidden"
        id="hero-media"
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="block h-[52vh] w-full object-cover will-change-transform max-[860px]:h-[42vh]"
        />
      </div>
    </section>
  )
}
