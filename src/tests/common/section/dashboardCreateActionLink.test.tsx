import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DashboardCreateActionLink from "../../../common/section/dashboardCreateActionLink";

function renderLink(to: string, label: string) {
  return render(
    <MemoryRouter>
      <DashboardCreateActionLink to={to}>{label}</DashboardCreateActionLink>
    </MemoryRouter>
  );
}

describe("DashboardCreateActionLink", () => {
  it("renders a navigation link with the provided accessible name", () => {
    renderLink("/dashboard/sauces/create", "Créer une sauce");

    expect(screen.getByRole("link", { name: "Créer une sauce" })).toBeInTheDocument();
  });

  it("points to the expected destination path", () => {
    renderLink("/dashboard/categories/create", "Créer une catégorie");

    expect(screen.getByRole("link", { name: "Créer une catégorie" })).toHaveAttribute("href", "/dashboard/categories/create");
  });

  it("applies shared dashboard action styles", () => {
    renderLink("/dashboard/sauces/create", "Créer une sauce");

    const link = screen.getByRole("link", { name: "Créer une sauce" });

    expect(link).toHaveClass("inline-flex");
    expect(link).toHaveClass("rounded-full");
    expect(link).toHaveClass("bg-primary");
    expect(link).toHaveClass("focus-visible:ring-2");
  });

  it("renders the exact text content provided as children", () => {
    renderLink("/dashboard/sauces/create", "Créer une nouvelle sauce");

    expect(screen.getByRole("link", { name: "Créer une nouvelle sauce" })).toHaveTextContent("Créer une nouvelle sauce");
  });
});
