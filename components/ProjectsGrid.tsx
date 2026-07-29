"use client";

import { useState } from "react";
import WorkCard from "./WorkCard";
import type { Project } from "@/lib/projects";

type ProjectsGridProps = {
  projects: Project[];
  series: string[];
};

export default function ProjectsGrid({ projects, series }: ProjectsGridProps) {
  const [filter, setFilter] = useState("all");
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const items = projects.filter((p) => filter === "all" || p.series === filter);

  return (
    <section className="projects-list works">
      <div
        className={`works-bg${hoverImage ? " active" : ""}`}
        style={hoverImage ? { backgroundImage: `url(${hoverImage})` } : undefined}
      />
      <div className="wrap">
        <div className="projects-filter">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
            All
          </button>
          {series.map((s) => (
            <button key={s} className={filter === s ? "active" : ""} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="works-grid">
          {items.map((p) => (
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
    </section>
  );
}
