import { defineField, defineType } from "sanity"

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "portrait",
      title: "Portrait image",
      type: "image",
      description: "About section photo. Leave empty to use the site default.",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Bio paragraphs (English)",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "bioNb",
      title: "Bio paragraphs (Norwegian)",
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
    select: { media: "portrait" },
    prepare({ media }) {
      return { title: "About", media }
    },
  },
})
