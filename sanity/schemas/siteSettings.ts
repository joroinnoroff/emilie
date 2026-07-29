import { defineField, defineType } from "sanity"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroStatement",
      title: "Hero statement",
      type: "text",
      rows: 3,
      description: "Main headline on the homepage hero",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA label",
      type: "string",
      initialValue: "See Works →",
    }),
    defineField({
      name: "basedIn",
      title: "Based in",
      type: "string",
      initialValue: "Based in Oslo",
    }),
    defineField({
      name: "bornIn",
      title: "Born in",
      type: "string",
      initialValue: "Born in 1997",
    }),
    defineField({
      name: "exhibitionBanner",
      title: "Exhibition banner text",
      type: "string",
      description: "Scrolling red banner on the hero",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero video",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      initialValue: "post@emilie.no",
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "contactIntro",
      title: "Contact intro",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "newsletterIntro",
      title: "Newsletter intro",
      type: "text",
      rows: 2,
      initialValue: "Subscribe for the latest exhibitions and creations.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" }
    },
  },
})
