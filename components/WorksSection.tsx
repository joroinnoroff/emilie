"use client";

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Mousewheel } from "swiper/modules";
import { PROJECTS } from "@/lib/projects";

import "swiper/css";
import "swiper/css/free-mode";

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
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="works" id="works">
      <div className="wrap">
        <div className="section-head">
          <h2>Selected Works</h2>
          <div className="works-nav">
            <button
              type="button"
              ref={prevRef}
              className="works-prev"
              aria-label="Previous works"
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              ref={nextRef}
              className="works-next"
              aria-label="Next works"
            >
              <Chevron dir="next" />
            </button>
          </div>
        </div>
      </div>

      <div className="works-swiper-wrap">
        <Swiper
          modules={[Navigation, FreeMode, Mousewheel]}
          onBeforeInit={(swiper) => {
            const nav = swiper.params.navigation;
            if (nav && typeof nav !== "boolean") {
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
            }
          }}
          onSwiper={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 0.9,
            momentumVelocityRatio: 0.7,
            momentumBounce: false,
            minimumVelocity: 0.02,
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.8,
            releaseOnEdges: true,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          grabCursor
          resistanceRatio={0.65}
          speed={650}
          spaceBetween={28}
          slidesPerView={1.25}
          breakpoints={{
            600: { slidesPerView: 2.2, spaceBetween: 28 },
            900: { slidesPerView: 3.2, spaceBetween: 32 },
            1200: { slidesPerView: 3.6, spaceBetween: 36 },
          }}
          className="works-swiper"
        >
          {HOME_WORKS.map((p) => (
            <SwiperSlide key={p.id}>
              <article className="work-slide">
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="wrap">
        <div className="works-cta">
          <Link href="/projects" className="btn">
            All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
