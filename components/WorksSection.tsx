"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import type { Project } from "@/lib/projects"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap, textLinkClass } from "./ui"

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="28" height="28" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={dir === "prev" ? "M9 2L4 7l5 5" : "M5 2l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type WorksSectionProps = {
  works: Project[]
}

export default function WorksSection({ works }: WorksSectionProps) {
  const { t } = useLocale()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
    duration: 25,
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, works])

  useEffect(() => {
    if (!emblaApi) return
    const onResize = () => emblaApi.reInit()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [emblaApi])

  return (
    <section className="relative mt-10 overflow-hidden pt-[120px] pb-20 md:pt-[140px]">
      <Wrap>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <h2
            id="works"
            className="min-w-0 max-w-full flex-1 basis-[12rem] scroll-mt-[124px] text-[clamp(1.85rem,3.2vw,2.85rem)] tracking-tight md:scroll-mt-[140px]"
          >
            {t("works.heading")}
          </h2>
          <Link href="/shop" className={`${textLinkClass} shrink-0 whitespace-nowrap`}>
            {t("works.all")}
          </Link>
        </div>
      </Wrap>

      <div className="relative">
        <div
          className="overflow-hidden pl-6 pr-6 md:pl-14 md:pr-12"
          ref={emblaRef}
        >
          <div className="flex touch-pan-y gap-5 md:gap-7">
            {works.map((p) => (
              <article
                key={p.id}
                className="flex min-w-0 shrink-0 grow-0 basis-auto flex-col"
              >
                <div className="flex w-fit flex-col">
                  <Link
                    href={`/shop/${p.id}`}
                    className="relative mb-4 block w-fit overflow-hidden bg-[#eee]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className="block h-auto max-h-[min(62vh,440px)] w-auto max-w-[min(86vw,820px)] select-none md:max-h-[min(62vh,520px)] md:max-w-[min(75vw,900px)]"
                      draggable={false}
                    />
                  </Link>
                  <div className="flex w-full flex-col items-start gap-1.5">
                    <div className="flex w-full items-baseline justify-between gap-3">
                      <h3 className="min-w-0 max-w-[70%] truncate text-lg font-medium tracking-tight">
                        {p.title}
                      </h3>
                      <span className="shrink-0 text-sm text-ink-soft">{p.size}</span>
                    </div>
                    <Link
                      href={`/shop/${p.id}`}
                      className="mt-1 border-b border-ink pb-px text-sm text-ink transition-opacity hover:opacity-50"
                    >
                      {t("works.info")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`absolute top-[40%] left-4 z-[2] flex h-[52px] w-[52px] -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#3a3a3a] transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] max-[860px]:left-2 max-[600px]:left-2 max-[600px]:h-11 max-[600px]:w-11 md:left-6 ${
            canPrev
              ? "opacity-100 hover:opacity-55"
              : "pointer-events-none opacity-0"
          }`}
          aria-label="Previous works"
          aria-hidden={!canPrev}
          tabIndex={canPrev ? 0 : -1}
          onClick={() => emblaApi?.scrollPrev()}
        >
          <Chevron dir="prev" />
        </button>
        <button
          type="button"
          className={`absolute top-[40%] right-4 z-[2] flex h-[52px] w-[52px] -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#3a3a3a] transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] max-[860px]:right-2 max-[600px]:right-2 max-[600px]:h-11 max-[600px]:w-11 md:right-6 ${
            canNext
              ? "opacity-100 hover:opacity-55"
              : "pointer-events-none opacity-0"
          }`}
          aria-label="Next works"
          aria-hidden={!canNext}
          tabIndex={canNext ? 0 : -1}
          onClick={() => emblaApi?.scrollNext()}
        >
          <Chevron dir="next" />
        </button>
      </div>
    </section>
  )
}
