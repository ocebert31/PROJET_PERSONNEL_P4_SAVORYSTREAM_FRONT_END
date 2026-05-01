import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageShell from "../../../common/layout/pageShell";

describe("PageShell", () => {
  it("renders title, default eyebrow and children", () => {
    render(
      <PageShell title="Gestion des recettes">
        <p>Page content</p>
      </PageShell>
    );

    expect(screen.getByText("Administration")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Gestion des recettes" })).toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("renders header action with split header layout", () => {
    render(
      <PageShell title="Gestion" headerAction={<button type="button">Action</button>} splitHeader>
        <p>Page content</p>
      </PageShell>
    );

    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("renders header suffix before children", () => {
    render(
      <PageShell title="Edition" headerSuffix={<p>Header helper</p>}>
        <p>Form content</p>
      </PageShell>
    );

    const helper = screen.getByText("Header helper");
    const formContent = screen.getByText("Form content");
    expect(helper.compareDocumentPosition(formContent) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders description when provided", () => {
    render(
      <PageShell title="Edition" description={<p>Description personnalisée</p>}>
        <p>Form content</p>
      </PageShell>
    );

    expect(screen.getByText("Description personnalisée")).toBeInTheDocument();
  });

  it("applies container class name and aria-busy on root", () => {
    const { container } = render(
      <PageShell title="Edition" containerClassName="max-w-7xl mx-auto" isBusy>
        <p>Form content</p>
      </PageShell>
    );

    expect(container.firstChild).toHaveClass("px-6", "py-10", "sm:py-14", "max-w-7xl", "mx-auto");
    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });

  it("renders header action outside split header by default", () => {
    render(
      <PageShell title="Edition" headerAction={<button type="button">Action</button>}>
        <p>Form content</p>
      </PageShell>
    );

    const heading = screen.getByRole("heading", { level: 1, name: "Edition" });
    const action = screen.getByRole("button", { name: "Action" });
    expect(heading.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
