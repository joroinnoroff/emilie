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
      title: "Original size",
      type: "string",
      description: "e.g. 60 × 50 cm",
    }),
    defineField({
      name: "stock",
      title: "Original stock",
      type: "number",
      description: "Usually 1 for unique originals",
      initialValue: 1,
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "priceNok",
      title: "Original price (NOK)",
      type: "number",
      description: "Shown when language is Norwegian — displays as e.g. 9 000 kr",
    }),
    defineField({
      name: "priceEur",
      title: "Original price (EUR)",
      type: "number",
      description: "Shown when language is English — displays as e.g. €900",
    }),
    defineField({
      name: "printAvailable",
      title: "Print available?",
      type: "boolean",
      description: "Offer print editions in addition to the original",
      initialValue: false,
    }),
    defineField({
      name: "prints",
      title: "Print sizes",
      type: "array",
      description: "Add one entry per print size / edition",
      hidden: ({ parent }) => !parent?.printAvailable,
      of: [
        {
          type: "object",
          name: "printEdition",
          title: "Print edition",
          fields: [
            {
              name: "size",
              title: "Size",
              type: "string",
              description: "e.g. 30 × 40 cm",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "stock",
              title: "Quantity",
              type: "number",
              initialValue: 10,
              validation: (Rule) => Rule.min(0).integer().required(),
            },
            {
              name: "priceNok",
              title: "Price (NOK)",
              type: "number",
              validation: (Rule) => Rule.min(0),
            },
            {
              name: "priceEur",
              title: "Price (EUR)",
              type: "number",
              validation: (Rule) => Rule.min(0),
            },
          ],
          preview: {
            select: { title: "size", stock: "stock", nok: "priceNok", eur: "priceEur" },
            prepare({ title, stock, nok, eur }) {
              const price =
                eur != null ? `€${eur}` : nok != null ? `${nok} kr` : "—"
              return {
                title: title || "Print",
                subtitle: `${price} · stock ${stock ?? 0}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: "status",
      title: "Original status",
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
