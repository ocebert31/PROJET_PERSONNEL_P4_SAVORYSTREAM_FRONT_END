import AsyncStateView from "@/common/feedback/asyncStateView";
import Button from "@/common/button/button";
import CheckoutPageLayout from "@/common/layout/checkoutPageLayout";
import CheckoutTotalSection from "@/common/section/checkoutTotalSection";
import CartLineRow from "@/components/Cart/CartLineRow";
import { useCart } from "@/context/cartContext";
import { useCartPageMutations } from "@/hooks/useCartPageMutations";
import type { CartPayload } from "@/types/cart";

function cartSummarySubtitle(cart: CartPayload): string {
  if (cart.items.length === 0) {
    return "Votre panier est vide.";
  }
  const { items_count: n } = cart;
  return `${n} article${n > 1 ? "s" : ""}`;
}

function CartPage() {
  const { cart, loadStatus, loadError, refreshCart } = useCart();
  const { busyLineId, clearBusy, changeLineQuantity, removeLineItem, clearEntireCart } = useCartPageMutations();

  const awaitingFirstCart = loadStatus === "loading" && cart === null;

  if (awaitingFirstCart || loadStatus === "error") {
    return (
      <CheckoutPageLayout title="Panier" compactHeader>
        <AsyncStateView isLoading={awaitingFirstCart} isError={loadStatus === "error"} loadingLabel="Chargement du panier…"
          errorMessage={loadError ?? "Erreur de chargement."} onRetry={() => void refreshCart()} minHeightClass="min-h-[12rem]"/>
      </CheckoutPageLayout>
    );
  }

  if (!cart) {
    return null;
  }

  const empty = cart.items.length === 0;

  return (
    <CheckoutPageLayout title="Panier" subtitle={cartSummarySubtitle(cart)}
      headerActions={
        !empty && (
          <Button type="button" variant="secondary" onClick={() => void clearEntireCart()} disabled={clearBusy}>
            Vider le panier
          </Button>
        )}>
      {!empty && (
        <>
          <ul className="ds-card mt-8 divide-y divide-border border border-border p-0">
            {cart.items.map((line) => (
              <CartLineRow key={line.id} line={line} busy={busyLineId === line.id}
                onIncrement={() => changeLineQuantity(line, line.quantity + 1)}
                onDecrement={() => changeLineQuantity(line, line.quantity - 1)}
                onRemove={() => removeLineItem(line)}/>
            ))}
          </ul>
          <CheckoutTotalSection amount={cart.total_amount} />
        </>
      )}
    </CheckoutPageLayout>
  );
}

export default CartPage;
