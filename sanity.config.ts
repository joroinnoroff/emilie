import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./sanity/schemas"
import { structure } from "./sanity/structure"
import { projectId, dataset, apiVersion } from "./sanity/env"
import { markInquirySoldAction } from "./sanity/actions/markInquirySold"
import { eraseInquiryPersonalDataAction } from "./sanity/actions/eraseInquiryPersonalData"
import { markWorkSoldAction } from "./sanity/actions/markWorkSold"
import { InquiriesDashboard } from "./sanity/tools/InquiriesDashboard"

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
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "inquiry") {
        return [...prev, markInquirySoldAction, eraseInquiryPersonalDataAction]
      }
      if (context.schemaType === "work") {
        return [...prev, markWorkSoldAction]
      }
      return prev
    },
  },
  tools: configured
    ? (prev) => [
        ...prev,
        {
          name: "sales-dashboard",
          title: "Sales & income",
          component: InquiriesDashboard,
        },
      ]
    : undefined,
})
