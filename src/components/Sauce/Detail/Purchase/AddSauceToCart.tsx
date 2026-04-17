import type { Conditioning, Sauce, SauceItem } from "@/types/sauce";

function AddSauceToCart(sauce: Sauce, selected: Conditioning, quantity: number) {
  const cart: SauceItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

  const existingIndex = cart.findIndex(
    (item) => item.sauceId === sauce.id && item.condId === selected.id
  );

  const cartItem: SauceItem = {
    sauceId: sauce.id,
    condId: selected.id,
    name: sauce.name,
    volume: parseFloat(selected.volume),
    prix: selected.prix,
    quantity,
  };

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

export default AddSauceToCart;
