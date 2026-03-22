import { describe, it, expect, beforeEach } from "vitest";
import type { Conditioning, Sauce } from "../../../../../types/Sauce";
import AddSauceToCart from "../../../../../components/Sauce/Detail/Purchase/AddSauceToCart";

const sauce: Sauce = {
  id: 10,
  name: "Sauce Test",
  description: "d",
  image_url: "/i.jpg",
  is_available: true,
  conditionnements: [],
};

const condA: Conditioning = { id: 1, volume: "250ml", prix: 4 };
const condB: Conditioning = { id: 2, volume: "500ml", prix: 7 };

describe("AddSauceToCart", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("appends a new line when cart is empty", () => {
    AddSauceToCart(sauce, condA, 2);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    expect(cart).toEqual([
      {
        sauceId: 10,
        condId: 1,
        name: "Sauce Test",
        volume: 250,
        prix: 4,
        quantity: 2,
      },
    ]);
  });

  it("merges quantity when same sauce and same conditioning already exist", () => {
    localStorage.setItem(
      "cart",
      JSON.stringify([
        { sauceId: 10, condId: 1, name: "Sauce Test", volume: 250, prix: 4, quantity: 1 },
      ])
    );
    AddSauceToCart(sauce, condA, 3);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(4);
  });

  it("adds a separate line for another conditioning", () => {
    AddSauceToCart(sauce, condA, 1);
    AddSauceToCart(sauce, condB, 2);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    expect(cart).toHaveLength(2);
    expect(cart[1].condId).toBe(2);
    expect(cart[1].quantity).toBe(2);
  });
});
