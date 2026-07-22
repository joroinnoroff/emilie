"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { PROJECTS } from "@/lib/projects";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const HOME_SERIES = ["Orchid Studies", "Coastal Thresholds"];
const HOME_WORKS = PROJECTS.filter((p) => HOME_SERIES.includes(p.series));

export default function WorksSection() {
  return (
    <section className="works" id="works">
      <div className="wrap">
        <div className="section-head">
          <h2>Selected Works</h2>


          <div className="works-cta">
          <Link href="/projects" className="btn">
            All Projects →
          </Link>
        </div>
        </div>
      </div>

      <div className="works-swiper-wrap">
        <Swiper
          modules={[Navigation, FreeMode]}
          freeMode
          navigation
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

    
    </section>
  );
}
