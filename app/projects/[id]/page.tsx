import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS, getProject, getSiblings } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  return { title: project ? `${project.title} — Emilie` : "Project — Emilie" };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return notFound();

  const { prev, next } = getSiblings(project.id);

  return (
    <>
      <section className="detail-hero">
        <div className="wrap">
          <div className="detail-img">
            <img src={project.image} alt={project.title} />
          </div>
          <div className="detail-meta">
            <div className="detail-eyebrow">
              {project.series} — {project.year}
            </div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className="detail-specs">
              <div>
                <span>Medium</span>
                <span>{project.medium}</span>
              </div>
              <div>
                <span>Size</span>
                <span>{project.size}</span>
              </div>
              <div>
                <span>Status</span>
                <span>{project.status}</span>
              </div>
            </div>
            {project.forSale && (
              <Link href={`/shop/${project.id}`} className="btn" style={{ marginTop: 24 }}>
                View in Shop
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="detail-nav">
          <Link href={`/projects/${prev.id}`}>
            <span className="dir">← Previous</span>
            {prev.title}
          </Link>
          <Link href={`/projects/${next.id}`}>
            <span className="dir">Next →</span>
            {next.title}
          </Link>
        </div>
      </div>
    </>
  );
}
