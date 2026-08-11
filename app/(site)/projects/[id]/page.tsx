import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getWorkBySlug, getWorkSiblings, getWorks } from "@/sanity/lib/fetch"
import ProjectDetailView from "@/components/ProjectDetailView"

export async function generateStaticParams() {
  const works = await getWorks()
  return works.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const project = await getWorkBySlug(id)
  return { title: project ? `${project.title} — Emilie` : "Emilie" }
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getWorkBySlug(id)
  if (!project) return notFound()

  const { prev, next } = await getWorkSiblings(project.id)

  return <ProjectDetailView project={project} prev={prev} next={next} />
}
