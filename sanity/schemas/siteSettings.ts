import { defineField, defineType } from "sanity"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroStatement",
      title: "Hero statement (English)",
      type: "text",
      rows: 3,
      description: "Shown when language is EN",
    }),
    defineField({
      name: "heroStatementNb",
      title: "Hero statement (Norwegian)",
      type: "text",
      rows: 3,
      description: "Shown when language is NO",
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA (English)",
      type: "string",
      initialValue: "See Works →",
    }),
    defineField({
      name: "heroCtaLabelNb",
      title: "Hero CTA (Norwegian)",
      type: "string",
      initialValue: "Se arbeider →",
    }),
    defineField({
      name: "basedIn",
      title: "Based in (English)",
      type: "string",
      initialValue: "Based in Oslo",
    }),
    defineField({
      name: "basedInNb",
      title: "Based in (Norwegian)",
      type: "string",
      initialValue: "Basert i Oslo",
    }),
    defineField({
      name: "bornIn",
      title: "Born in (English)",
      type: "string",
      initialValue: "Born in 1997",
    }),
    defineField({
      name: "bornInNb",
      title: "Born in (Norwegian)",
      type: "string",
      initialValue: "Født i 1997",
    }),
    defineField({
      name: "exhibitionBanner",
      title: "Exhibition banner (English)",
      type: "string",
      description: "Scrolling red banner — EN",
    }),
    defineField({
      name: "exhibitionBannerNb",
      title: "Exhibition banner (Norwegian)",
      type: "string",
      description: "Scrolling red banner — NO",
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
      title: "Contact intro (English)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "contactIntroNb",
      title: "Contact intro (Norwegian)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "newsletterIntro",
      title: "Newsletter intro (English)",
      type: "text",
      rows: 2,
      initialValue: "Subscribe for the latest exhibitions and creations.",
    }),
    defineField({
      name: "newsletterIntroNb",
      title: "Newsletter intro (Norwegian)",
      type: "text",
      rows: 2,
      initialValue: "Abonner for siste utstillinger og verk.",
    }),
    defineField({
      name: "commissionHeading",
      title: "Commission heading (English)",
      type: "string",
      initialValue: "Looking for a Custom Artwork?",
    }),
    defineField({
      name: "commissionHeadingNb",
      title: "Commission heading (Norwegian)",
      type: "string",
      initialValue: "Ønsker du et verk?",
    }),
    defineField({
      name: "commissionBody",
      title: "Commission body (English)",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "One item per paragraph",
    }),
    defineField({
      name: "commissionBodyNb",
      title: "Commission body (Norwegian)",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "One item per paragraph",
    }),
    defineField({
      name: "commissionCta",
      title: "Commission CTA (English)",
      type: "string",
      initialValue: "Contact",
    }),
    defineField({
      name: "commissionCtaNb",
      title: "Commission CTA (Norwegian)",
      type: "string",
      initialValue: "Kontakt",
    }),
    defineField({
      name: "deliveryOptions",
      title: "Delivery options",
      type: "array",
      description: "Shown at checkout — set prices in NOK and EUR",
      of: [
        {
          type: "object",
          name: "deliveryOption",
          fields: [
            {
              name: "key",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Pick-up in Oslo", value: "pickup" },
                  { title: "Shipping in Norway", value: "norway" },
                  { title: "Shipping abroad", value: "abroad" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "label",
              title: "Label (English)",
              type: "string",
              description: "Optional override, e.g. Pick-up in Oslo",
            },
            {
              name: "labelNb",
              title: "Label (Norwegian)",
              type: "string",
            },
            {
              name: "priceNok",
              title: "Price (NOK)",
              type: "number",
              description: "Use 0 for free",
              initialValue: 0,
              validation: (Rule) => Rule.min(0).required(),
            },
            {
              name: "priceEur",
              title: "Price (EUR)",
              type: "number",
              description: "Use 0 for free",
              initialValue: 0,
              validation: (Rule) => Rule.min(0).required(),
            },
            {
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true,
            },
          ],
          preview: {
            select: {
              key: "key",
              label: "label",
              nok: "priceNok",
              eur: "priceEur",
              enabled: "enabled",
            },
            prepare({ key, label, nok, eur, enabled }) {
              const titles: Record<string, string> = {
                pickup: "Pick-up in Oslo",
                norway: "Shipping in Norway",
                abroad: "Shipping abroad",
              }
              return {
                title: label || titles[key] || key,
                subtitle: `${enabled === false ? "Off · " : ""}${nok ?? 0} kr / €${eur ?? 0}`,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" }
    },
  },
})
