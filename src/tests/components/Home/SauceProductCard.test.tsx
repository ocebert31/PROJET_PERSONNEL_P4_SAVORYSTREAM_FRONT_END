import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Sauce } from "../../../types/Sauce";
import SauceProductCard from "../../../components/home/SauceProductCard";

const mockSauce: Sauce = {
  id: 42,
  name: "Sauce Test",
  description: "Desc",
  image_url: "/img.jpg",
  is_available: true,
  accroche: "Une accroche",
  conditionnements: [{ id: 1, volume: "250ml", prix: 4.5 }],
};

describe("SauceProductCard", () => {
  it("renders name, accroche, price and link to detail", () => {
    render(
      <MemoryRouter>
        <SauceProductCard sauce={mockSauce} />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Sauce Test" })).toBeInTheDocument();
    expect(screen.getByText("Une accroche")).toBeInTheDocument();
    expect(screen.getByText("4.50 €")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Découvrir la sauce Sauce Test/i })).toHaveAttribute("href", "/sauce/42");
  });

  it("shows rupture badge when unavailable", () => {
    render(
      <MemoryRouter>
        <SauceProductCard sauce={{ ...mockSauce, is_available: false }} />
      </MemoryRouter>
    );
    expect(screen.getByText("En rupture")).toBeInTheDocument();
  });
});
