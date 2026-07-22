"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { PROJECTS } from "@/lib/projects";

const HOME_SERIES = ["Orchid Studies", "Coastal Thresholds"];
const HOME_WORKS = PROJECTS.filter((p) => HOME_SERIES.includes(p.series));

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={dir === "prev" ? "M9 2L4 7l5 5" : "M5 2l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WorksSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="works" id="works">
      <div className="wrap">
        <div className="section-head">
          <h2>Selected Works</h2>
          <Link href="/projects" className="btn">
            All Projects →
          </Link>
        </div>
      </div>

      <div className="works-embla-wrap">
        <div className="works-embla" ref={emblaRef}>
          <div className="works-embla-track">
            {HOME_WORKS.map((p) => (
              <article className="work-slide" key={p.id}>
                <div className="work-thumb">
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="work-slide-meta">
                  <h3 className="work-title">{p.title}</h3>
                  <p className="work-slide-series">
                    {p.series} — {p.year}
                  </p>
                  <Link href={`/projects/${p.id}`} className="work-info-btn">
                    Info
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="wrap works-nav-row">
          <div className="works-nav">
            <button
              type="button"
              className="works-prev"
              aria-label="Previous works"
              disabled={!canPrev}
              onClick={() => emblaApi?.scrollPrev()}
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              className="works-next"
              aria-label="Next works"
              disabled={!canNext}
              onClick={() => emblaApi?.scrollNext()}
            >
              <Chevron dir="next" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
