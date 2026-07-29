import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./sanity/schemas"
import { structure } from "./sanity/structure"
import { projectId, dataset, apiVersion } from "./sanity/env"

const configured = Boolean(projectId)

export default defineConfig({
  name: "emilie",
  title: "Emilie Admin",
  projectId: projectId || "placeholder",
  dataset,
  basePath: "/studio",
  plugins: configured
    ? [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })]
    : [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
})
