import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SauceDetailBreadcrumb from "../../../../../components/Sauce/Detail/Layout/SauceDetailBreadcrumb";

describe("SauceDetailBreadcrumb", () => {
  it("renders home link and product name", () => {
    render(
      <MemoryRouter>
        <SauceDetailBreadcrumb productName="Sauce BBQ" />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Sauce BBQ")).toBeInTheDocument();
  });
});
