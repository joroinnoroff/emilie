import type { Metadata } from "next";
import ProjectsGrid from "@/components/ProjectsGrid";
import { getSeriesNames, getWorks } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "All Projects — Emilie",
};

export default async function ProjectsPage() {
  const [projects, series] = await Promise.all([getWorks(), getSeriesNames()]);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <h1>All Projects</h1>
        </div>
      </section>
      <ProjectsGrid projects={projects} series={series} />
    </>
  );
}
