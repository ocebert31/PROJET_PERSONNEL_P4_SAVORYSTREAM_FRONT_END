import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "../../../pages/dashboard/dashboardPage";

describe("dashboardPage", () => {
  function renderDashboard(initialPath: string, outlet: string = "Outlet content") {
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route path="sauces" element={<div>{outlet}</div>} />
            <Route path="sauces/create" element={<div>{outlet}</div>} />
            <Route path="sauces/:id/edit" element={<div>{outlet}</div>} />
            <Route path="categories" element={<div>{outlet}</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
  }

  describe("nominal case", () => {
    it("renders admin navigation and outlet content", () => {
      renderDashboard("/dashboard/sauces/create", "Create view");

      expect(screen.getAllByText("Dashboard admin").length).toBeGreaterThan(0);
      expect(screen.getAllByRole("link", { name: "Sauces" }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("link", { name: "Catégories" }).length).toBeGreaterThan(0);
      expect(screen.getByText("Create view")).toBeInTheDocument();
    });
  });

  describe("variations", () => {
    it("exposes desktop and mobile nav landmarks with the same destinations", () => {
      renderDashboard("/dashboard/sauces");

      const mobileNav = screen.getByRole("navigation", { name: "Navigation admin mobile" });
      const desktopNav = screen.getByRole("navigation", { name: "Navigation admin" });

      const mobileLinks = within(mobileNav).getAllByRole("link");
      const desktopLinks = within(desktopNav).getAllByRole("link");

      expect(mobileLinks.map((link) => link.getAttribute("href"))).toEqual(
        desktopLinks.map((link) => link.getAttribute("href")),
      );
    });

    it("keeps outlet rendering correct on categories route", () => {
      renderDashboard("/dashboard/categories", "Categories view");
      expect(screen.getByText("Categories view")).toBeInTheDocument();
      expect(screen.getAllByRole("link", { name: "Catégories", current: "page" })).toHaveLength(2);
    });
  });
});
