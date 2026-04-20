import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Sauce } from "../../../../../types/sauce";
import SauceBuySection from "../../../../../components/Sauce/Detail/Purchase/SauceBuySection";

vi.mock("@/components/Sauce/Detail/Purchase/AddToCartButton", () => ({
  default: () => <button type="button">Ajouter au panier</button>,
}));

const sauce: Sauce = {
  id: "1",
  name: "S",
  description: "d",
  image_url: "/i.jpg",
  is_available: true,
  conditionnements: [],
};

const selected = { id: "1", volume: "250ml", prix: 10, stock: 5 };

describe("SauceBuySection", () => {
  it("increments and decrements quantity within bounds", async () => {
    const setQuantity = vi.fn();
    render(<SauceBuySection sauce={sauce} selected={selected} quantity={2} setQuantity={setQuantity} />);
    await userEvent.click(screen.getByRole("button", { name: /Augmenter la quantité/i }));
    expect(setQuantity).toHaveBeenCalled();
    const updater = setQuantity.mock.calls[0][0] as (q: number) => number;
    expect(updater(2)).toBe(3);
    await userEvent.click(screen.getByRole("button", { name: /Diminuer la quantité/i }));
    const dec = setQuantity.mock.calls[1][0] as (q: number) => number;
    expect(dec(2)).toBe(1);
  });

  it("shows total from prix and quantity", () => {
    const setQuantity = vi.fn();
    render(<SauceBuySection sauce={sauce} selected={selected} quantity={3} setQuantity={setQuantity} />);
    expect(screen.getByText(/Total : 30.00 €/)).toBeInTheDocument();
  });
});
