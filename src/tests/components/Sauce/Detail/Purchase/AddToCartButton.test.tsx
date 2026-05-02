import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { Conditioning, Sauce } from "../../../../../types/sauce";
import AddToCartButton from "../../../../../components/Sauce/Detail/Purchase/AddToCartButton";
import * as cartContext from "../../../../../context/cartContext";

const sauce: Sauce = {
  id: "1",
  name: "Sauce X",
  description: "d",
  image_url: "/x.jpg",
  is_available: true,
  conditionnements: [],
};

const selected: Conditioning = { id: "1", volume: "250ml", prix: 4 };

const showErrorMock = vi.fn();

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: showErrorMock,
  }),
}));

describe("AddToCartButton", () => {
  const addItem = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    addItem.mockClear();
    showErrorMock.mockClear();
    vi.spyOn(cartContext, "useCart").mockReturnValue({
      cart: null,
      loadStatus: "ready",
      loadError: null,
      refreshCart: vi.fn(),
      addItem,
      updateLineQuantity: vi.fn(),
      removeLine: vi.fn(),
      clearCart: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls addItem on click when available without showing success toast", async () => {
    render(<AddToCartButton sauce={sauce} selected={selected} quantity={2} />);
    await userEvent.click(screen.getByRole("button", { name: /Ajouter cette sauce au panier/i }));
    expect(addItem).toHaveBeenCalledWith("1", "1", 2);
    expect(showErrorMock).not.toHaveBeenCalled();
  });

  it("renders nothing when selected is null", () => {
    const { container } = render(<AddToCartButton sauce={sauce} selected={null} quantity={1} />);
    expect(container.firstChild).toBeNull();
  });

  it("is disabled when sauce unavailable", () => {
    render(<AddToCartButton sauce={{ ...sauce, is_available: false }} selected={selected} quantity={1} />);
    expect(screen.getByRole("button", { name: /Produit indisponible/i })).toBeDisabled();
  });
});
