import type { Metadata } from "next";
import ProjectsGrid from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "All Projects — Emilie",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <h1>All Projects</h1>
        </div>
      </section>
      <ProjectsGrid />
    </>
  );
}
