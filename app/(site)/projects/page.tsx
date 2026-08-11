import type { Metadata } from "next"
import ProjectsGrid from "@/components/ProjectsGrid"
import ProjectsHeading from "@/components/ProjectsHeading"
import { Wrap } from "@/components/ui"
import { getSeriesNames, getWorks } from "@/sanity/lib/fetch"

export const metadata: Metadata = {
  title: "Alle prosjekter — Emilie",
}

export default async function ProjectsPage() {
  const [projects, series] = await Promise.all([getWorks(), getSeriesNames()])

  return (
    <>
      <section className="pt-[140px] pb-8 md:pt-[150px] md:pb-10">
        <Wrap>
          <ProjectsHeading />
        </Wrap>
      </section>
      <ProjectsGrid projects={projects} series={series} />
    </>
  )
}
