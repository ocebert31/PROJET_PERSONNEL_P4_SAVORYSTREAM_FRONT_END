import { useCallback, useState } from "react";
import type { AddToCartProps } from "@/types/sauce";
import { useToast } from "@/hooks/useToast";
import { useCart } from "@/context/cartContext";
import Button from "@/common/button/button";
import { toErrorMessage } from "@/utils/errorMessage";

function AddToCartButton({ sauce, selected, quantity }: AddToCartProps) {
  const { showError } = useToast();
  const { addItem } = useCart();
  const [pending, setPending] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (!sauce || !selected) return;
    setPending(true);
    try {
      await addItem(sauce.id, selected.id, quantity);
    } catch (e) {
      showError(toErrorMessage(e, "Impossible d’ajouter au panier."));
    } finally {
      setPending(false);
    }
  }, [sauce, selected, quantity, addItem, showError]);

  if (!sauce || !selected) return null;

  const buttonLabel = sauce.is_available ? "Ajouter cette sauce au panier" : "Produit indisponible";

  return (
    <Button type="button" onClick={() => void handleAddToCart()} disabled={!sauce.is_available || pending} variant={sauce.is_available ? "primary" : "secondary"} size="lg" fullWidth className="active:scale-[0.99]">
      {buttonLabel}
    </Button>
  );
}

export default AddToCartButton;
