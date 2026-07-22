"use client";

import { useState } from "react";
import Link from "next/link";
import WorkCard from "./WorkCard";
import { PROJECTS } from "@/lib/projects";

const HOME_SERIES = ["Orchid Studies", "Coastal Thresholds"];

function yearsRange(series: string) {
  const years = PROJECTS.filter((p) => p.series === series).map((p) => Number(p.year));
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? `${min}` : `${min}–${max}`;
}

export default function WorksSection() {
  const [hoverImage, setHoverImage] = useState<string | null>(null);

  return (
    <section className="works" id="works">
      <div
        className={`works-bg${hoverImage ? " active" : ""}`}
        style={hoverImage ? { backgroundImage: `url(${hoverImage})` } : undefined}
      />
      <div className="wrap">
        <div className="section-head">
          <h2>Selected Works</h2>
        </div>

        {HOME_SERIES.map((series) => (
          <div className="series-block" key={series}>
            <div className="series-head">
              <b>{series}</b> <span>— {yearsRange(series)}</span>
            </div>
            <div className="works-grid">
              {PROJECTS.filter((p) => p.series === series).map((p) => (
                <WorkCard
                  key={p.id}
                  href={`/projects/${p.id}`}
                  image={p.image}
                  title={p.title}
                  onHoverImage={setHoverImage}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="works-cta">
          <Link href="/projects" className="btn">
            All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
