import { defineField, defineType } from "sanity"

export const work = defineType({
  name: "work",
  title: "Works",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "series",
      title: "Series",
      type: "reference",
      to: [{ type: "series" }],
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
      initialValue: "Oil on canvas",
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      description: "e.g. 60 × 50 cm",
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      description: "Use 1 for unique originals (no quantity stepper in cart)",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "priceNok",
      title: "Price (NOK)",
      type: "number",
      description: "Whole kroner for Vipps / Scandinavia",
    }),
    defineField({
      name: "priceEur",
      title: "Price (EUR)",
      type: "number",
      description: "Whole euros for Stripe",
    }),
    defineField({
      name: "priceUsd",
      title: "Price (USD)",
      type: "number",
      description: "Whole dollars for Stripe",
    }),
    defineField({
      name: "price",
      title: "Price label (display)",
      type: "string",
      description: "Optional display string, e.g. €1,450 — checkout uses numeric prices",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "Available" },
          { title: "Sold", value: "Sold" },
        ],
        layout: "radio",
      },
      initialValue: "Available",
    }),
    defineField({
      name: "forSale",
      title: "Show in shop",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "year",
      media: "image",
      status: "status",
    },
    prepare({ title, subtitle, media, status }) {
      return {
        title,
        subtitle: [subtitle, status].filter(Boolean).join(" · "),
        media,
      }
    },
  },
  orderings: [
    {
      title: "Year, Newest",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
})
