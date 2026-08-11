"use client"

import { useState } from "react"
import WorkCard from "./WorkCard"
import type { Project } from "@/lib/projects"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap, cn } from "./ui"

type ProjectsGridProps = {
  projects: Project[]
  series: string[]
}

export default function ProjectsGrid({ projects, series }: ProjectsGridProps) {
  const { t } = useLocale()
  const [filter, setFilter] = useState("all")
  const items = projects.filter((p) => filter === "all" || p.series === filter)
  const filters = [
    { id: "all", label: t("projects.all") },
    ...series.map((s) => ({ id: s, label: s })),
  ]

  return (
    <section className="pb-[100px]">
      <Wrap>
        <nav
          className="mb-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-line pb-5"
          aria-label="Filter"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={cn(
                "cursor-pointer border-0 bg-transparent p-0 font-inherit text-[0.9375rem] tracking-wide transition-colors",
                filter === f.id ? "text-ink" : "text-ink-soft hover:text-ink"
              )}
              onClick={() => setFilter(f.id)}
            >
              <span
                className={cn(
                  "border-b pb-0.5",
                  filter === f.id ? "border-ink" : "border-transparent"
                )}
              >
                {f.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 max-[860px]:grid-cols-2 max-[600px]:grid-cols-1">
          {items.map((p) => (
            <WorkCard
              key={p.id}
              href={`/projects/${p.id}`}
              image={p.image}
              title={p.title}
            />
          ))}
        </div>
      </Wrap>
    </section>
  )
}
