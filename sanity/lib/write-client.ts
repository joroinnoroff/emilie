import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId } from "../env"

/** Write client for inquiries + mark sold. Needs SANITY_API_WRITE_TOKEN. */
export const writeClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export const canWriteSanity = Boolean(
  projectId && process.env.SANITY_API_WRITE_TOKEN
)
