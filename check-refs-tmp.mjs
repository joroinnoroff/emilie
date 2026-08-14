import { createClient } from "@sanity/client"
import { readFileSync } from "node:fs"

for (const line of readFileSync(".env", "utf8").split("\n")) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const eq = trimmed.indexOf("=")
  if (eq === -1) continue
  const key = trimmed.slice(0, eq).trim()
  let value = trimmed.slice(eq + 1).trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
  if (!(key in process.env)) process.env[key] = value
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const ids = ["EZtgEk1jIgI8yOQaphe7kz","EZtgEk1jIgI8yOQaphhBGL","KxszAYJoItKTI5nOORUMSb","Xwn7BWRxH6qQXgP1j6UR7Z","Xwn7BWRxH6qQXgP1j6URXM"]
const docs = await client.fetch(`*[_id in $ids]`, { ids })
console.log(JSON.stringify(docs, null, 2))
