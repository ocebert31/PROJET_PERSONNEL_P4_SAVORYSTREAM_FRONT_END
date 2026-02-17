import { useCallback } from "react";
import { AddToCartProps } from "../../../types/Sauce";
import AddSauceToCart from "./AddSauceToCart";

function AddToCartButton({ sauce, selected, quantity }: AddToCartProps) {
  if (!sauce || !selected) return null;

  const handleAddToCart = useCallback(() => {
    AddSauceToCart(sauce, selected, quantity);
    alert(`${quantity} x ${sauce.name} ajouté${quantity > 1 ? "s" : ""} au panier !`);
  }, [sauce, selected, quantity]);

  const buttonLabel = sauce.is_available ? "Ajouter au panier" : "Indisponible";
  const buttonClasses = `
    w-full py-4 rounded-full text-lg font-semibold transition-transform
    ${sauce.is_available
      ? "bg-primary text-white hover:scale-105 active:scale-95"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"}
  `;

  return (
    <button onClick={handleAddToCart} disabled={!sauce.is_available} className={buttonClasses}>
      {buttonLabel}
    </button>
  );
}

export default AddToCartButton;
