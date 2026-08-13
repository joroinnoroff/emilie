"use client"

import Link from "next/link"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { createPortal } from "react-dom"
import InfinityBanner from "./InfinityBanner"
import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"
import { cn, Wrap } from "./ui"

type HeroProps = {
  settings: SiteSettings
}

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="currentColor"
        d="M3 21v-5h2v3h3v2zm13 0v-2h3v-3h2v5zM3 8V3h5v2H5v3zm16 0V5h-3V3h5v5z"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.42 6.29 6.29-6.3 6.3 1.42 1.4 6.29-6.29 6.3 6.3 1.4-1.42-6.29-6.29 6.3-6.3z" />
    </svg>
  )
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.5 12a4.5 4.5 0 0 0-1.5-3.35v6.7A4.48 4.48 0 0 0 16.5 12ZM4 9v6h3.5L12 19.5V4.5L7.5 9H4Zm14.15 3L21 14.85 19.85 16 17 13.15 14.15 16 13 14.85 15.85 12 13 9.15 14.15 8 17 10.85 19.85 8 21 9.15 18.15 12Z" />
      </svg>
    )
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 9v6h3.5L12 19.5V4.5L7.5 9H4Zm11.5 3a4.5 4.5 0 0 0-1.5-3.35v6.7A4.48 4.48 0 0 0 15.5 12Zm0-7.77v2.06A6.99 6.99 0 0 1 19.5 12a6.99 6.99 0 0 1-4 6.71v2.06A9 9 0 0 0 21.5 12a9 9 0 0 0-6-7.77Z" />
    </svg>
  )
}

export default function Hero({ settings }: HeroProps) {
  const { locale, t } = useLocale()
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fsVideoRef = useRef<HTMLVideoElement>(null)
  const videoSrc = settings.heroVideoUrl || "/hero.mp4"
  const audioEnabled = Boolean(settings.heroVideoAudio)

  const [fullscreen, setFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const seekingRef = useRef(false)

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
    setMounted(true)
  }, [])

  useEffect(() => {
    const media = mediaRef.current
    const video = videoRef.current
    if (!media || !video) return

    let raf = 0
    const update = () => {
      raf = 0
      if (fullscreen) {
        video.style.transform = "none"
        return
      }
      const rect = media.getBoundingClientRect()
      const viewH = window.innerHeight || 1
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
  }, [fullscreen])

  const closeFullscreen = useCallback(() => {
    const inline = videoRef.current
    const fs = fsVideoRef.current
    if (inline && fs && !Number.isNaN(fs.currentTime)) {
      inline.currentTime = fs.currentTime
      void inline.play().catch(() => {})
    }
    setFullscreen(false)
    setMuted(true)
    setProgress(0)
    setDuration(0)
  }, [])

  const openFullscreen = useCallback(() => {
    setMuted(true)
    setFullscreen(true)
    videoRef.current?.pause()
  }, [])

  const seekToRatio = useCallback((ratio: number) => {
    const fs = fsVideoRef.current
    if (!fs || !Number.isFinite(fs.duration) || fs.duration <= 0) return
    const next = Math.max(0, Math.min(1, ratio))
    fs.currentTime = next * fs.duration
    setProgress(next)
  }, [])

  const formatTime = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${String(s).padStart(2, "0")}`
  }, [])

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [fullscreen, closeFullscreen])

  // Sync playback into TikTok-style overlay once it mounts
  useEffect(() => {
    if (!fullscreen) return
    const inline = videoRef.current
    const fs = fsVideoRef.current
    if (!fs) return
    if (inline && !Number.isNaN(inline.currentTime)) {
      fs.currentTime = inline.currentTime
    }
    fs.muted = muted
    void fs.play().catch(() => {})
  }, [fullscreen]) // eslint-disable-line react-hooks/exhaustive-deps -- sync once on open

  useEffect(() => {
    const fs = fsVideoRef.current
    if (!fullscreen || !fs) return
    fs.muted = muted
    if (!muted) {
      void fs.play().catch(() => {
        setMuted(true)
        fs.muted = true
      })
    }
  }, [fullscreen, muted])

  useEffect(() => {
    if (!fullscreen) return
    const fs = fsVideoRef.current
    if (!fs) return

    const syncDuration = () => {
      if (Number.isFinite(fs.duration) && fs.duration > 0) {
        setDuration(fs.duration)
      }
    }
    const onTimeUpdate = () => {
      if (seekingRef.current) return
      syncDuration()
      if (Number.isFinite(fs.duration) && fs.duration > 0) {
        setProgress(fs.currentTime / fs.duration)
      }
    }

    syncDuration()
    onTimeUpdate()
    fs.addEventListener("timeupdate", onTimeUpdate)
    fs.addEventListener("loadedmetadata", syncDuration)
    fs.addEventListener("durationchange", syncDuration)
    return () => {
      fs.removeEventListener("timeupdate", onTimeUpdate)
      fs.removeEventListener("loadedmetadata", syncDuration)
      fs.removeEventListener("durationchange", syncDuration)
    }
  }, [fullscreen])

  const overlay =
    mounted && fullscreen
      ? createPortal(
          <div
            className="fixed inset-0 z-[400] flex items-center justify-center bg-black"
            role="dialog"
            aria-modal="true"
            aria-label={t("shop.fullscreen")}
            onClick={closeFullscreen}
          >
            {/* TikTok-style stage: 9:16 — only in fullscreen */}
            <div
              className={cn(
                "relative z-[1] overflow-hidden bg-black",
                "h-[100svh] w-[min(100vw,calc(100svh*9/16))]",
                "md:h-[min(100svh,920px)] md:w-[min(100vw,calc(min(100svh,920px)*9/16))]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={fsVideoRef}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-end gap-1 bg-gradient-to-b from-black/50 to-transparent p-3 pb-12">
                {audioEnabled ? (
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-white transition-opacity hover:opacity-70"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={
                      muted
                        ? locale === "nb"
                          ? "Slå på lyd"
                          : "Unmute"
                        : locale === "nb"
                          ? "Demp"
                          : "Mute"
                    }
                  >
                    <SpeakerIcon muted={muted} />
                  </button>
                ) : null}
                <button
                  type="button"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-white transition-opacity hover:opacity-70"
                  onClick={closeFullscreen}
                  aria-label={locale === "nb" ? "Lukk" : "Close"}
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="mb-1.5 flex items-center justify-between text-[11px] tabular-nums text-white/80">
                  <span>{formatTime(progress * duration)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <label className="sr-only" htmlFor="hero-fs-seek">
                  {locale === "nb" ? "Spol i video" : "Seek video"}
                </label>
                <input
                  id="hero-fs-seek"
                  type="range"
                  min={0}
                  max={1}
                  step={0.001}
                  value={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  aria-label={locale === "nb" ? "Spol i video" : "Seek video"}
                  className="hero-fs-seek w-full cursor-pointer appearance-none bg-transparent"
                  style={
                    {
                      ["--hero-seek"]: `${Math.round(progress * 1000) / 10}%`,
                    } as CSSProperties
                  }
                  onPointerDown={() => {
                    seekingRef.current = true
                  }}
                  onPointerUp={() => {
                    seekingRef.current = false
                  }}
                  onPointerCancel={() => {
                    seekingRef.current = false
                  }}
                  onChange={(e) => {
                    seekToRatio(Number(e.target.value))
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <>
      <section
        className="relative flex min-h-[100svh] flex-col p-0"
        id="hero"
      >
        <div className="relative shrink-0">
          {banner ? <InfinityBanner text={banner} /> : null}
          <div className="pt-[7.5rem] pl-9 max-[860px]:pt-[8.25rem] max-[860px]:pl-[1.85rem]">
            <Wrap className="flex flex-col gap-8 pb-9 max-[860px]:gap-7 max-[860px]:pb-8">
              <h1 className="max-w-[18ch] text-[clamp(1.85rem,3.2vw,2.85rem)] leading-[1.05] tracking-tight max-[860px]:max-w-none">
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
          <div className="flex justify-between gap-4 px-12 pb-9 pl-[calc(2.25rem+3rem)] text-sm text-ink-soft max-[860px]:px-6 max-[860px]:pl-[calc(1.85rem+1.5rem)] max-[860px]:pb-8">
            <span>{basedIn}</span>
            <span>{bornIn}</span>
          </div>
        </div>

        <div
          ref={mediaRef}
          className="relative w-full shrink-0 overflow-hidden"
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
            className="block h-[44vh] w-full object-cover will-change-transform max-[860px]:h-[36vh]"
          />

          <button
            type="button"
            className="absolute right-3 bottom-3 z-[2] flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-black/35 text-white backdrop-blur-sm transition-opacity hover:opacity-80"
            onClick={openFullscreen}
            aria-label={t("shop.fullscreen")}
          >
            <ExpandIcon />
          </button>
        </div>

        {/* Keeps first screen at 100svh without stretching the video */}
        <div className="min-h-8 flex-1" aria-hidden />
      </section>
      {overlay}
    </>
  )
}
