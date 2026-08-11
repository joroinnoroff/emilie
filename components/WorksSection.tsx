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
    align: "center",
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
    <section className="relative mt-10 overflow-hidden pt-[120px] pb-20 md:pt-[140px]" id="works">
      <Wrap>
        <div className="mb-9 flex items-end justify-between gap-6">
          <h2 className="text-[clamp(2.25rem,4.2vw,3.5rem)] tracking-tight">
            {t("works.heading")}
          </h2>
          <Link href="/projects" className={textLinkClass}>
            {t("works.all")}
          </Link>
        </div>
      </Wrap>

      <div className="relative">
        <div
          className="overflow-hidden px-6 md:px-12"
          ref={emblaRef}
        >
          <div className="flex touch-pan-y gap-7">
            {works.map((p) => (
              <article
                key={p.id}
                className="flex min-w-0 shrink-0 grow-0 basis-[78%] flex-col max-[600px]:basis-[78%] min-[600px]:basis-[42%] min-[900px]:basis-[30%] min-[1200px]:basis-[26%]"
              >
                <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-[#eee]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover select-none"
                    draggable={false}
                  />
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <div className="flex w-full items-baseline justify-between gap-3">
                    <h3 className="min-w-0 truncate text-lg font-medium tracking-tight">
                      {p.title}
                    </h3>
                    <span className="shrink-0 text-sm text-ink-soft">{p.size}</span>
                  </div>
                  <Link
                    href={`/projects/${p.id}`}
                    className="mt-1 border-b border-ink pb-px text-sm text-ink transition-opacity hover:opacity-50"
                  >
                    {t("works.info")}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {canPrev ? (
          <button
            type="button"
            className="absolute top-[40%] left-4 z-[2] flex h-[52px] w-[52px] -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-ink transition-opacity hover:opacity-45 max-[860px]:left-2 max-[600px]:left-2 max-[600px]:h-11 max-[600px]:w-11 md:left-6"
            aria-label="Previous works"
            onClick={() => emblaApi?.scrollPrev()}
          >
            <Chevron dir="prev" />
          </button>
        ) : null}
        {canNext ? (
          <button
            type="button"
            className="absolute top-[40%] right-4 z-[2] flex h-[52px] w-[52px] -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-ink transition-opacity hover:opacity-45 max-[860px]:right-2 max-[600px]:right-2 max-[600px]:h-11 max-[600px]:w-11 md:right-6"
            aria-label="Next works"
            onClick={() => emblaApi?.scrollNext()}
          >
            <Chevron dir="next" />
          </button>
        ) : null}
      </div>
    </section>
  )
}
