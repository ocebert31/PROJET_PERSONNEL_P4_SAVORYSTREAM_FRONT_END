import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { Conditioning, Sauce } from "../../../../../types/Sauce";
import AddToCartButton from "../../../../../components/Sauce/Detail/Purchase/AddToCartButton";

const sauce: Sauce = {
  id: 1,
  name: "Sauce X",
  description: "d",
  image_url: "/x.jpg",
  is_available: true,
  conditionnements: [],
};

const selected: Conditioning = { id: 1, volume: "250ml", prix: 4 };

vi.mock("@/components/Sauce/Detail/Purchase/AddSauceToCart", () => ({
  default: vi.fn(),
}));

import AddSauceToCart from "@/components/Sauce/Detail/Purchase/AddSauceToCart";

describe("AddToCartButton", () => {
  beforeEach(() => {
    vi.mocked(AddSauceToCart).mockClear();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls AddSauceToCart and alert on click when available", async () => {
    render(<AddToCartButton sauce={sauce} selected={selected} quantity={2} />);
    await userEvent.click(screen.getByRole("button", { name: /Ajouter au panier/i }));
    expect(AddSauceToCart).toHaveBeenCalledWith(sauce, selected, 2);
    expect(window.alert).toHaveBeenCalled();
  });

  it("renders nothing when selected is null", () => {
    const { container } = render(<AddToCartButton sauce={sauce} selected={null} quantity={1} />);
    expect(container.firstChild).toBeNull();
  });

  it("is disabled when sauce unavailable", () => {
    render(<AddToCartButton sauce={{ ...sauce, is_available: false }} selected={selected} quantity={1} />);
    expect(screen.getByRole("button", { name: /Indisponible/i })).toBeDisabled();
  });
});
