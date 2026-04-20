import { useCallback } from "react";
import type { AddToCartProps } from "@/types/sauce";
import AddSauceToCart from "@/components/Sauce/Detail/Purchase/AddSauceToCart";
import { useToast } from "@/hooks/useToast";
import Button from "@/common/button/Button";

function AddToCartButton({ sauce, selected, quantity }: AddToCartProps) {
  const { showSuccess } = useToast();

  const handleAddToCart = useCallback(() => {
    if (!sauce || !selected) return;
    AddSauceToCart(sauce, selected, quantity);
    showSuccess(`${quantity} × ${sauce.name} ajouté${quantity > 1 ? "s" : ""} au panier.`);
  }, [sauce, selected, quantity, showSuccess]);

  if (!sauce || !selected) return null;

  const buttonLabel = sauce.is_available ? "Ajouter cette sauce au panier" : "Produit indisponible";

  return (
    <Button type="button" onClick={handleAddToCart} disabled={!sauce.is_available} variant={sauce.is_available ? "primary" : "secondary"} size="lg" fullWidth className="active:scale-[0.99]">
      {buttonLabel}
    </Button>
  );
}

export default AddToCartButton;
