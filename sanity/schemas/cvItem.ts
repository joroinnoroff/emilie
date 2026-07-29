import { defineField, defineType } from "sanity"

export const cvItem = defineType({
  name: "cvItem",
  title: "CV item",
  type: "object",
  fields: [
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "detail", title: "Detail", type: "string" }),
  ],
  preview: {
    select: { title: "title", subtitle: "year" },
  },
})
