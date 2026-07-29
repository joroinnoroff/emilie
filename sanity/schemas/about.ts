import { defineField, defineType } from "sanity"

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Bio paragraphs",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [{ type: "cvItem" }],
    }),
    defineField({
      name: "exhibitions",
      title: "Selected exhibitions",
      type: "array",
      of: [{ type: "cvItem" }],
    }),
    defineField({
      name: "awards",
      title: "Awards",
      type: "array",
      of: [{ type: "cvItem" }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "About" }
    },
  },
})
