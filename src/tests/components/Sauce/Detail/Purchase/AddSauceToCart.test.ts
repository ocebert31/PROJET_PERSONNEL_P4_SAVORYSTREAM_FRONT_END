import { describe, it, expect, beforeEach } from "vitest";
import type { Conditioning, Sauce } from "../../../../../types/sauce";
import AddSauceToCart from "../../../../../components/Sauce/Detail/Purchase/AddSauceToCart";

const SAUCE_UUID = "10101010-1010-1010-1010-101010101010";
const COND_A_UUID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const COND_B_UUID = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

const sauce: Sauce = {
  id: SAUCE_UUID,
  name: "Sauce Test",
  description: "d",
  image_url: "/i.jpg",
  is_available: true,
  conditionnements: [],
};

const condA: Conditioning = { id: COND_A_UUID, volume: "250ml", prix: 4 };
const condB: Conditioning = { id: COND_B_UUID, volume: "500ml", prix: 7 };

describe("AddSauceToCart", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("appends a new line when cart is empty", () => {
    AddSauceToCart(sauce, condA, 2);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    expect(cart).toEqual([
      {
        sauceId: SAUCE_UUID,
        condId: COND_A_UUID,
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
        { sauceId: SAUCE_UUID, condId: COND_A_UUID, name: "Sauce Test", volume: 250, prix: 4, quantity: 1 },
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
    expect(cart[1].condId).toBe(COND_B_UUID);
    expect(cart[1].quantity).toBe(2);
  });
});
