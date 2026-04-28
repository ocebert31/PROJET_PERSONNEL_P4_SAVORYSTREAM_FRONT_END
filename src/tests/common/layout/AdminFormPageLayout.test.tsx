import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminFormPageLayout from "../../../common/layout/AdminFormPageLayout";

describe("AdminFormPageLayout", () => {
  it("renders title and children with default eyebrow", () => {
    render(
      <AdminFormPageLayout title="Nouvelle sauce">
        <p>Form content</p>
      </AdminFormPageLayout>
    );

    expect(screen.getByText("Administration")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Nouvelle sauce" })).toBeInTheDocument();
    expect(screen.getByText("Form content")).toBeInTheDocument();
  });

  it("renders custom eyebrow when provided", () => {
    render(
      <AdminFormPageLayout title="Edition" eyebrow="Backoffice">
        <p>Form content</p>
      </AdminFormPageLayout>
    );

    expect(screen.getByText("Backoffice")).toBeInTheDocument();
    expect(screen.queryByText("Administration")).not.toBeInTheDocument();
  });

  it("renders description content when provided", () => {
    render(
      <AdminFormPageLayout
        title="Nouvelle catégorie"
        description={<p>Description personnalisée</p>}
      >
        <p>Form content</p>
      </AdminFormPageLayout>
    );

    expect(screen.getByText("Description personnalisée")).toBeInTheDocument();
  });

  it("renders header content before children", () => {
    render(
      <AdminFormPageLayout
        title="Edition"
        headerContent={<p>Header helper</p>}
      >
        <p>Form content</p>
      </AdminFormPageLayout>
    );

    const helper = screen.getByText("Header helper");
    const formContent = screen.getByText("Form content");
    expect(helper.compareDocumentPosition(formContent) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
