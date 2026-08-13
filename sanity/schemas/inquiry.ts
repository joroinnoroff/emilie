import { defineArrayMember, defineField, defineType } from "sanity"

export const inquiry = defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  description:
    "Shop inquiries from the website. Personvern / GDPR: delete this document to erase the customer’s personal data (name, email, phone, message).",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In progress", value: "in_progress" },
          { title: "Sold", value: "sold" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "new",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "receivedAt",
      title: "Received",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "shippingLocation",
      title: "Desired shipping / location",
      type: "text",
      rows: 2,
      description: "Where the customer wants the work shipped",
    }),
    defineField({
      name: "message",
      title: "Customer message",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "locale",
      title: "Site language",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Norwegian", value: "no" },
          { title: "English", value: "en" },
        ],
      },
    }),
    defineField({
      name: "lines",
      title: "Works inquired about",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "inquiryLine",
          title: "Line",
          fields: [
            defineField({
              name: "work",
              title: "Work",
              type: "reference",
              to: [{ type: "work" }],
            }),
            defineField({
              name: "title",
              title: "Title (snapshot)",
              type: "string",
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
              validation: (Rule) => Rule.min(1).integer(),
            }),
            defineField({
              name: "priceNok",
              title: "Price (NOK)",
              type: "number",
            }),
            defineField({
              name: "priceEur",
              title: "Price (EUR)",
              type: "number",
            }),
            defineField({
              name: "imageUrl",
              title: "Image URL",
              type: "url",
              readOnly: true,
            }),
          ],
          preview: {
            select: {
              title: "title",
              variant: "variant",
              printSize: "printSize",
              qty: "qty",
              media: "work.image",
            },
            prepare({ title, variant, printSize, qty, media }) {
              const version =
                variant === "print"
                  ? `Print${printSize ? ` · ${printSize}` : ""}`
                  : "Original"
              return {
                title: title || "Work",
                subtitle: `${version} × ${qty ?? 1}`,
                media,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: "saleAmountNok",
      title: "Sale amount (NOK)",
      type: "number",
      description: "Filled when marked sold (editable if invoice differs)",
      hidden: ({ parent }) => parent?.status !== "sold",
    }),
    defineField({
      name: "saleAmountEur",
      title: "Sale amount (EUR)",
      type: "number",
      hidden: ({ parent }) => parent?.status !== "sold",
    }),
    defineField({
      name: "soldAt",
      title: "Sold at",
      type: "datetime",
      readOnly: true,
      hidden: ({ parent }) => parent?.status !== "sold",
    }),
    defineField({
      name: "internalNotes",
      title: "Internal notes",
      type: "text",
      rows: 3,
      description: "Private notes — not shown to the customer",
    }),
  ],
  preview: {
    select: {
      name: "name",
      status: "status",
      receivedAt: "receivedAt",
      line0: "lines.0.title",
      media: "lines.0.work.image",
    },
    prepare({ name, status, receivedAt, line0, media }) {
      const date = receivedAt
        ? new Date(receivedAt).toLocaleDateString("nb-NO")
        : ""
      return {
        title: name || "Inquiry",
        subtitle: [status, line0, date].filter(Boolean).join(" · "),
        media,
      }
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "receivedDesc",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],
})
