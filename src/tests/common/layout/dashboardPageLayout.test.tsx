import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardPageLayout from "../../../common/layout/dashboardPageLayout";

describe("DashboardPageLayout", () => {
  it("renders title, default eyebrow and children", () => {
    render(
      <DashboardPageLayout title="Gestion des sauces">
        <p>Dashboard content</p>
      </DashboardPageLayout>
    );

    expect(screen.getByText("Administration")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Gestion des sauces" })).toBeInTheDocument();
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("renders custom eyebrow when provided", () => {
    render(
      <DashboardPageLayout title="Gestion" eyebrow="Backoffice">
        <p>Dashboard content</p>
      </DashboardPageLayout>
    );

    expect(screen.getByText("Backoffice")).toBeInTheDocument();
    expect(screen.queryByText("Administration")).not.toBeInTheDocument();
  });

  it("renders description and action when provided", () => {
    render(
      <DashboardPageLayout
        title="Gestion"
        description={<p>Description personnalisée</p>}
        action={<button type="button">Nouvelle sauce</button>}
      >
        <p>Dashboard content</p>
      </DashboardPageLayout>
    );

    expect(screen.getByText("Description personnalisée")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nouvelle sauce" })).toBeInTheDocument();
  });

  it("applies contentClassName on root container", () => {
    const { container } = render(
      <DashboardPageLayout title="Gestion" contentClassName="max-w-7xl mx-auto">
        <p>Dashboard content</p>
      </DashboardPageLayout>
    );

    expect(container.firstChild).toHaveClass("px-6", "py-10", "sm:py-14", "max-w-7xl", "mx-auto");
  });

  it("sets aria-busy when busy state is enabled", () => {
    const { container } = render(
      <DashboardPageLayout title="Gestion" isBusy>
        <p>Dashboard content</p>
      </DashboardPageLayout>
    );

    expect(container.firstChild).toHaveAttribute("aria-busy", "true");
  });
});
