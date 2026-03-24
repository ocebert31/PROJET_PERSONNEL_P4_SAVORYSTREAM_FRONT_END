import { useCallback } from "react";
import type { AddToCartProps } from "@/types/Sauce";
import AddSauceToCart from "@/components/Sauce/Detail/Purchase/AddSauceToCart";

function AddToCartButton({ sauce, selected, quantity }: AddToCartProps) {
  const handleAddToCart = useCallback(() => {
    if (!sauce || !selected) return;
    AddSauceToCart(sauce, selected, quantity);
    alert(`${quantity} × ${sauce.name} ajouté${quantity > 1 ? "s" : ""} au panier !`);
  }, [sauce, selected, quantity]);

  if (!sauce || !selected) return null;

  const buttonLabel = sauce.is_available ? "Ajouter au panier" : "Indisponible";
  const buttonClasses = sauce.is_available
    ? "w-full rounded-full bg-primary py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover hover:shadow-xl active:scale-[0.99]"
    : "w-full cursor-not-allowed rounded-full bg-border py-4 text-base font-semibold text-muted";

  return (
    <button type="button" onClick={handleAddToCart} disabled={!sauce.is_available} className={buttonClasses}>
      {buttonLabel}
    </button>
  );
}

export default AddToCartButton;
