import type { StructureResolver } from "sanity/structure"

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("About")
        .id("about")
        .child(S.document().schemaType("about").documentId("about")),
      S.divider(),
      S.documentTypeListItem("work").title("Works"),
      S.documentTypeListItem("series").title("Series"),
    ])
