import { createClient } from "next-sanity"
import imageUrlBuilder from "@sanity/image-url"
import { apiVersion, dataset, projectId } from "../env"

export const hasSanityConfig = Boolean(projectId)

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  // Skip CDN in development so Studio edits show up quickly
  useCdn: process.env.NODE_ENV === "production",
})

const builder = imageUrlBuilder(client)

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
}
