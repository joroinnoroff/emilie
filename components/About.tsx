"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { AboutContent } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"
import { cn } from "./ui"

type AboutProps = {
  content: AboutContent
}

function CvGroup({
  heading,
  items,
  active,
}: {
  heading: string
  items?: { year?: string; title?: string; detail?: string }[]
  active: boolean
}) {
  if (!items?.length) return null

  return (
    <div className="mb-5 last:mb-0">
      <h3
        className={cn(
          "mb-3 border-t pt-2.5 text-[0.8125rem] transition-colors duration-500",
          active
            ? "border-white/35 text-white/75"
            : "border-line text-ink-soft"
        )}
      >
        {heading}
      </h3>
      {items.map((item, i) => (
        <div
          className="mb-2.5 flex gap-4 text-sm"
          key={`${item.year}-${item.title}-${i}`}
        >
          <span
            className={cn(
              "w-[80px] shrink-0 transition-colors duration-500",
              active ? "text-white" : "text-ink"
            )}
          >
            {item.year}
          </span>
          <span
            className={cn(
              "transition-colors duration-500",
              active ? "text-white/80" : "text-ink-soft"
            )}
          >
            {item.title ? (
              <b
                className={cn(
                  "font-medium transition-colors duration-500",
                  active ? "text-white" : "text-ink"
                )}
              >
                {item.title}
              </b>
            ) : null}
            {item.title && item.detail ? " — " : null}
            {item.detail}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function About({ content }: AboutProps) {
  const { locale } = useLocale()
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [inView, setInView] = useState(false)

  const bio =
    locale === "nb"
      ? content.bioNb?.length
        ? content.bioNb
        : content.bio
      : content.bio?.length
        ? content.bio
        : content.bioNb

  useEffect(() => {
    const el = sectionRef.current
    const media = mediaRef.current
    const image = imageRef.current
    if (!el) return

    let raf = 0
    const update = () => {
      raf = 0
      const { top, bottom } = el.getBoundingClientRect()
      // Flip a bit before the section edge hits the header for a tighter sync
      const early = 88
      const active = top <= early && bottom > early
      setInView(active)
      document.documentElement.dataset.aboutTheme = active ? "1" : ""

      if (media && image) {
        const rect = media.getBoundingClientRect()
        const viewH = window.innerHeight || 1
        const offset = rect.top + rect.height * 0.5 - viewH * 0.5
        const shift = Math.max(-56, Math.min(56, offset * -0.18))
        image.style.transform = `translate3d(0, ${shift}px, 0) scale(1.14)`
      }
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
      document.documentElement.dataset.aboutTheme = ""
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-[140vh] border-t transition-colors duration-300",
        inView
          ? "border-transparent bg-about text-white"
          : "border-line bg-white text-ink"
      )}
    >
      {/* Anchor sits further into the tall section so nav /#about scrolls deeper */}
      <div
        id="about"
        aria-hidden
        className="pointer-events-none absolute top-[min(28vh,270px)] left-0 h-px w-px scroll-mt-28 min-[861px]:top-[min(37vh,360px)] lg:top-[min(34vh,340px)]"
      />
      <div className="mx-auto grid min-h-[140vh] w-full max-w-[1480px] grid-cols-1 gap-10 px-6 pt-[100px] pb-[56px] md:grid-cols-[0.78fr_1.22fr] md:gap-14 md:px-12 md:pb-[72px] lg:gap-16">
        <div className="relative order-2 md:order-1">
          <div className="md:sticky md:top-[88px] md:flex md:h-[calc(100vh-88px)] md:items-center md:justify-center">
            <div
              ref={mediaRef}
              className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden md:max-h-[68vh] md:max-w-[380px] lg:max-w-[420px]"
            >
              <Image
                ref={imageRef}
                src="/about-portrait.png"
                alt={
                  locale === "nb"
                    ? "Emilie foran et av sine malerier"
                    : "Emilie in front of one of her paintings"
                }
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                className="object-cover object-[50%_18%] will-change-transform"
                style={{ transform: "translate3d(0, 0, 0) scale(1.14)" }}
                priority={false}
              />
            </div>
          </div>
        </div>

        <div className="order-1 flex flex-col justify-center md:order-2 md:py-8">
          <h2
            className={cn(
              "mb-6 text-[clamp(1.65rem,2.8vw,2.4rem)] leading-[1.05] tracking-tight transition-colors duration-500",
              inView ? "text-white" : "text-ink"
            )}
          >
            {locale === "nb" ? "Om meg" : "About"}
          </h2>
          {bio?.map((paragraph, i) => (
            <p
              key={i}
              className={cn(
                "mb-4 max-w-[500px] text-[1.025rem] leading-relaxed transition-colors duration-500",
                inView ? "text-white/85" : "text-ink-soft"
              )}
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-4 max-w-[580px]">
            <CvGroup
              active={inView}
              heading={locale === "nb" ? "Utdanning" : "Education"}
              items={content.education}
            />
            <CvGroup
              active={inView}
              heading={
                locale === "nb" ? "Utvalgte utstillinger" : "Selected Exhibitions"
              }
              items={content.exhibitions}
            />
            <CvGroup
              active={inView}
              heading={locale === "nb" ? "Priser" : "Awards"}
              items={content.awards}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
