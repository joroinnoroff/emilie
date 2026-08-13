import { defineField, defineType } from "sanity"

/** Single source of truth for income graph (inquiry + work sales). */
export const sale = defineType({
  name: "sale",
  title: "Sale",
  type: "document",
  description: "Recorded when a work or inquiry is marked sold. Powers the income graph.",
  fields: [
    defineField({
      name: "soldAt",
      title: "Sold at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountNok",
      title: "Amount (NOK)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "amountEur",
      title: "Amount (EUR)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Original", value: "original" },
          { title: "Print", value: "print" },
        ],
      },
    }),
    defineField({
      name: "printSize",
      title: "Print size",
      type: "string",
      hidden: ({ parent }) => parent?.variant !== "print",
    }),
    defineField({
      name: "qty",
      title: "Quantity",
      type: "number",
      initialValue: 1,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Inquiry", value: "inquiry" },
          { title: "Work", value: "work" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "work",
      title: "Work",
      type: "reference",
      to: [{ type: "work" }],
    }),
    defineField({
      name: "inquiry",
      title: "Inquiry",
      type: "reference",
      to: [{ type: "inquiry" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      nok: "amountNok",
      eur: "amountEur",
      soldAt: "soldAt",
      media: "work.image",
    },
    prepare({ title, nok, eur, soldAt, media }) {
      const amount =
        nok != null ? `${nok} kr` : eur != null ? `€${eur}` : "—"
      const date = soldAt
        ? new Date(soldAt).toLocaleDateString("nb-NO")
        : ""
      return {
        title: title || "Sale",
        subtitle: [amount, date].filter(Boolean).join(" · "),
        media,
      }
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "soldDesc",
      by: [{ field: "soldAt", direction: "desc" }],
    },
  ],
})
