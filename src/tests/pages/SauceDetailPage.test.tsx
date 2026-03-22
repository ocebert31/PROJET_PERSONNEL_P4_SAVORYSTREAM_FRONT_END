import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SauceDetail from "../../pages/SauceDetailPage";

vi.mock("../../data/sauces.json", () => ({
  default: [
    {
      id: 1,
      name: "Sauce Barbecue Test",
      description: "Description détaillée pour les tests.",
      caracteristique: "Goût fumé",
      image_url: "/assets/test-bbq.jpg",
      is_available: true,
      accroche: "Accroche test",
      conditionnements: [
        { id: 1, volume: "250ml", prix: 3.99 },
        { id: 2, volume: "500ml", prix: 6.49 },
      ],
      ingredients: [
        { id: 1, name: "Tomate", quantité: "200g" },
        { id: 2, name: "Paprika", quantité: "5g" },
      ],
    },
  ],
}));

function renderSauceDetail(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/sauce/:id" element={<SauceDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("SauceDetailPage", () => {
  it("renders product detail for a valid id", () => {
    renderSauceDetail("/sauce/1");
    expect(screen.getByRole("heading", { level: 1, name: "Sauce Barbecue Test" })).toBeInTheDocument();
    expect(screen.getByText("Description détaillée pour les tests.")).toBeInTheDocument();
    expect(screen.getByText("Choisis ton format")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(screen.getAllByText("Sauce Barbecue Test").length).toBeGreaterThanOrEqual(2);
    const img = screen.getByRole("img", { name: "Sauce Barbecue Test" });
    expect(img).toHaveAttribute("src", "/assets/test-bbq.jpg");
    expect(screen.getByRole("button", { name: /250ml/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /500ml/i })).toBeInTheDocument();
  });

  it("renders characteristic and ingredients tabs", () => {
    renderSauceDetail("/sauce/1");
    expect(screen.getByText("Goût fumé")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ingrédients/i })).toBeInTheDocument();
  });

  it("switches to the Ingredients tab", async () => {
    renderSauceDetail("/sauce/1");
    await userEvent.click(screen.getByRole("button", { name: /Ingrédients/i }));
    expect(screen.getByText("Tomate")).toBeInTheDocument();
    expect(screen.getByText("200g")).toBeInTheDocument();
  });

  it("renders not found state for an unknown id", () => {
    renderSauceDetail("/sauce/999");
    expect(screen.getByText("Sauce introuvable")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1, name: "Sauce Barbecue Test" })).not.toBeInTheDocument();
  });
});
