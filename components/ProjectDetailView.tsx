"use client"

import Link from "next/link"
import type { Project } from "@/lib/projects"
import FullscreenImage from "@/components/FullscreenImage"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap, btnClass } from "./ui"

type ProjectDetailViewProps = {
  project: Project
  prev: Project
  next: Project
}

export default function ProjectDetailView({
  project,
  prev,
  next,
}: ProjectDetailViewProps) {
  const { t } = useLocale()
  const statusLabel =
    project.status === "Sold" ? t("shop.sold") : t("shop.available")

  return (
    <>
      <section className="pt-[130px]">
        <Wrap className="mb-4">
          <Link
            href="/projects"
            aria-label={t("projects.heading")}
            className="inline-flex items-center text-ink transition-opacity hover:opacity-50"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 5L8 12l7 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Wrap>
        <Wrap className="grid grid-cols-1 items-start gap-[60px] md:grid-cols-[0.85fr_1fr] max-[860px]:gap-10">
          <FullscreenImage src={project.image} alt={project.title} />
          <div>
            <div className="mb-2 text-sm text-ink-soft">
              {project.series} — {project.year}
            </div>
            <h1 className="mb-4 text-[clamp(2rem,4vw,3rem)] tracking-tight">
              {project.title}
            </h1>
            <p className="mb-8 max-w-[440px] text-[1.0625rem] text-ink-soft">
              {project.description}
            </p>
            <div className="mb-5 flex flex-col gap-3 border-t border-line pt-5 text-sm">
              <div className="flex max-w-[340px] justify-between gap-4">
                <span className="text-ink-soft">{t("shop.medium")}</span>
                <span>{project.medium}</span>
              </div>
              <div className="flex max-w-[340px] justify-between gap-4">
                <span className="text-ink-soft">{t("projects.size")}</span>
                <span>{project.size}</span>
              </div>
              <div className="flex max-w-[340px] justify-between gap-4">
                <span className="text-ink-soft">{t("shop.status")}</span>
                <span>{statusLabel}</span>
              </div>
            </div>
            {project.forSale ? (
              <Link
                href={`/shop/${project.id}`}
                className={`${btnClass} mt-6`}
              >
                {t("projects.viewShop")}
              </Link>
            ) : null}
          </div>
        </Wrap>
      </section>

      <Wrap>
        <div className="mt-16 mb-20 flex justify-between gap-8 border-t border-line pt-8">
          <Link href={`/projects/${prev.id}`} className="max-w-[45%]">
            <span className="mb-1.5 block text-sm text-ink-soft">
              {t("projects.prev")}
            </span>
            <span className="text-ink-soft transition-colors hover:text-ink">
              {prev.title}
            </span>
          </Link>
          <Link href={`/projects/${next.id}`} className="max-w-[45%] text-right">
            <span className="mb-1.5 block text-sm text-ink-soft">
              {t("projects.next")}
            </span>
            <span className="text-ink-soft transition-colors hover:text-ink">
              {next.title}
            </span>
          </Link>
        </div>
      </Wrap>
    </>
  )
}
