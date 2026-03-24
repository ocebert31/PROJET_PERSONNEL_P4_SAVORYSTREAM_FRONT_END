import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Sauce } from "../../../types/Sauce";
import HomeCatalogue from "../../../components/home/HomeCatalogue";

const sauces: Sauce[] = [
  {
    id: 1,
    name: "Alpha Sauce",
    description: "d1",
    image_url: "/a.jpg",
    is_available: true,
    accroche: "First tagline",
    conditionnements: [{ id: 1, volume: "250ml", prix: 2 }],
  },
  {
    id: 2,
    name: "Beta Sauce",
    description: "d2",
    image_url: "/b.jpg",
    is_available: true,
    accroche: "Second tagline",
    conditionnements: [{ id: 2, volume: "500ml", prix: 5 }],
  },
];

describe("HomeCatalogue", () => {
  it("renders section title, description and catalogue id", () => {
    render(
      <MemoryRouter>
        <HomeCatalogue sauces={sauces} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2, name: /Nos Sauces Maison/ })).toBeInTheDocument();
    expect(
      screen.getByText(/Une sélection gourmande pour tous les goûts/i)
    ).toBeInTheDocument();
    expect(document.getElementById("catalogue")).toBeTruthy();
  });

  it("renders a card for each sauce", () => {
    render(
      <MemoryRouter>
        <HomeCatalogue sauces={sauces} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Alpha Sauce" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Beta Sauce" })).toBeInTheDocument();
  });

  it("renders empty grid when sauces array is empty", () => {
    const { container } = render(
      <MemoryRouter>
        <HomeCatalogue sauces={[]} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2, name: /Nos Sauces Maison/ })).toBeInTheDocument();
    const grid = container.querySelector("#catalogue .grid");
    expect(grid?.children.length).toBe(0);
  });
});
