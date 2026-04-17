import { useCallback } from "react";
import type { AddToCartProps } from "@/types/sauce";
import AddSauceToCart from "@/components/Sauce/Detail/Purchase/AddSauceToCart";
import { useToast } from "@/hooks/useToast";

function AddToCartButton({ sauce, selected, quantity }: AddToCartProps) {
  const { showSuccess } = useToast();

  const handleAddToCart = useCallback(() => {
    if (!sauce || !selected) return;
    AddSauceToCart(sauce, selected, quantity);
    showSuccess(`${quantity} × ${sauce.name} ajouté${quantity > 1 ? "s" : ""} au panier.`);
  }, [sauce, selected, quantity, showSuccess]);

  if (!sauce || !selected) return null;

  const buttonLabel = sauce.is_available ? "Ajouter cette sauce au panier" : "Produit indisponible";
  const buttonClasses = sauce.is_available
    ? "min-h-11 w-full rounded-full bg-primary px-4 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover hover:shadow-xl active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    : "min-h-11 w-full cursor-not-allowed rounded-full bg-border px-4 py-4 text-base font-semibold text-muted";

  return (
    <button type="button" onClick={handleAddToCart} disabled={!sauce.is_available} className={buttonClasses}>
      {buttonLabel}
    </button>
  );
}

export default AddToCartButton;
