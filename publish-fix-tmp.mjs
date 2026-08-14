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

const DRAFT_ID = "drafts.32f2cde5-695b-40c2-9fb2-2716353e0996"
const REAL_ID = "32f2cde5-695b-40c2-9fb2-2716353e0996"
const REF_IDS = ["EZtgEk1jIgI8yOQaphe7kz","EZtgEk1jIgI8yOQaphhBGL","KxszAYJoItKTI5nOORUMSb","Xwn7BWRxH6qQXgP1j6UR7Z","Xwn7BWRxH6qQXgP1j6URXM"]

// Step 1: create the real published document from the draft's content
const draft = await client.getDocument(DRAFT_ID)
if (!draft) throw new Error("Draft not found")
const { _id, _rev, ...rest } = draft
const published = { ...rest, _id: REAL_ID }
await client.createOrReplace(published)
console.log(`Step 1: created published doc ${REAL_ID}`)

// Step 2: repoint the 5 referencing documents from draft id to real id
const refDocs = await client.fetch(`*[_id in $ids]`, { ids: REF_IDS })
const tx = client.transaction()
for (const doc of refDocs) {
  if (doc._type === "sale") {
    if (doc.work?._ref === DRAFT_ID) {
      tx.patch(doc._id, (p) => p.set({ "work._ref": REAL_ID }))
    }
  } else if (doc._type === "inquiry") {
    let changed = false
    const lines = (doc.lines || []).map((line) => {
      if (line.work?._ref === DRAFT_ID) {
        changed = true
        return { ...line, work: { ...line.work, _ref: REAL_ID } }
      }
      return line
    })
    if (changed) tx.patch(doc._id, (p) => p.set({ lines }))
  }
}
await tx.commit()
console.log("Step 2: repointed 5 references")

// Step 3: delete the now-unreferenced draft
await client.delete(DRAFT_ID)
console.log(`Step 3: deleted draft ${DRAFT_ID}`)

console.log("Done.")
