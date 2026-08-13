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
      S.divider(),
      S.listItem()
        .title("Inquiries")
        .id("inquiries")
        .child(
          S.list()
            .title("Inquiries")
            .items([
              S.listItem()
                .title("All inquiries")
                .id("inquiries-all")
                .child(
                  S.documentTypeList("inquiry")
                    .title("All inquiries")
                    .defaultOrdering([{ field: "receivedAt", direction: "desc" }])
                ),
              S.listItem()
                .title("New")
                .id("inquiries-new")
                .child(
                  S.documentTypeList("inquiry")
                    .title("New")
                    .filter('_type == "inquiry" && status == "new"')
                    .defaultOrdering([{ field: "receivedAt", direction: "desc" }])
                ),
              S.listItem()
                .title("In progress")
                .id("inquiries-progress")
                .child(
                  S.documentTypeList("inquiry")
                    .title("In progress")
                    .filter('_type == "inquiry" && status == "in_progress"')
                    .defaultOrdering([{ field: "receivedAt", direction: "desc" }])
                ),
              S.listItem()
                .title("Sold")
                .id("inquiries-sold")
                .child(
                  S.documentTypeList("inquiry")
                    .title("Sold")
                    .filter('_type == "inquiry" && status == "sold"')
                    .defaultOrdering([{ field: "soldAt", direction: "desc" }])
                ),
              S.listItem()
                .title("Closed")
                .id("inquiries-closed")
                .child(
                  S.documentTypeList("inquiry")
                    .title("Closed")
                    .filter('_type == "inquiry" && status == "closed"')
                    .defaultOrdering([{ field: "receivedAt", direction: "desc" }])
                ),
              S.divider(),
              S.listItem()
                .title("Sales (income)")
                .id("sales-all")
                .child(
                  S.documentTypeList("sale")
                    .title("Sales")
                    .defaultOrdering([{ field: "soldAt", direction: "desc" }])
                ),
            ])
        ),
    ])
