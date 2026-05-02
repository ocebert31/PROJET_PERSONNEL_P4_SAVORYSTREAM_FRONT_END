import { useCallback, useState } from "react";
import { useCart } from "@/context/cartContext";
import { useToast } from "@/hooks/useToast";
import type { CartLineItem } from "@/types/cart";
import { toErrorMessage } from "@/utils/errorMessage";

const CLEAR_CART_SUCCESS = "Panier vidé.";

const LINE_ACTION_ERROR = "Action impossible. Réessayez.";
const CLEAR_CART_ERROR = "Impossible de vider le panier.";

type MutationScope = { kind: "line"; lineId: string } | { kind: "clear" };

export type UseCartPageMutationsResult = {
  busyLineId: string | null;
  clearBusy: boolean;
  changeLineQuantity: (line: CartLineItem, nextQty: number) => void;
  removeLineItem: (line: CartLineItem) => void;
  clearEntireCart: () => void;
};

export function useCartPageMutations(): UseCartPageMutationsResult {
  const { refreshCart, updateLineQuantity, removeLine, clearCart } = useCart();
  const { showSuccess, showError } = useToast();

  const [busyLineId, setBusyLineId] = useState<string | null>(null);
  const [clearBusy, setClearBusy] = useState(false);

  const runCartMutation = useCallback(
    async ( scope: MutationScope, execute: () => Promise<void>, successMessage: string | null, errorFallback: string ) => {
      const lockUi = () => {
        if (scope.kind === "line") {
          setBusyLineId(scope.lineId);
          return;
        }
        setClearBusy(true);
      };

      const unlockUi = () => {
        if (scope.kind === "line") {
          setBusyLineId(null);
          return;
        }
        setClearBusy(false);
      };

      lockUi();
      try {
        await execute();
        if (successMessage !== null) {
          showSuccess(successMessage);
        }
      } catch (e) {
        showError(toErrorMessage(e, errorFallback));
        await refreshCart();
      } finally {
        unlockUi();
      }
    },
    [refreshCart, showError, showSuccess],
  );

  const runLineMutation = useCallback(
    (line: CartLineItem, execute: () => Promise<void>) => {
      void runCartMutation({ kind: "line", lineId: line.id }, execute, null, LINE_ACTION_ERROR);
    },
    [runCartMutation],
  );

  const changeLineQuantity = useCallback(
    (line: CartLineItem, nextQty: number) => {
      runLineMutation(line, () => updateLineQuantity(line.id, nextQty));
    },
    [runLineMutation, updateLineQuantity],
  );

  const removeLineItem = useCallback(
    (line: CartLineItem) => {
      runLineMutation(line, () => removeLine(line.id));
    },
    [removeLine, runLineMutation],
  );

  const clearEntireCart = useCallback(() => {
    void runCartMutation({ kind: "clear" }, () => clearCart(), CLEAR_CART_SUCCESS, CLEAR_CART_ERROR);
  }, [clearCart, runCartMutation]);

  return {
    busyLineId,
    clearBusy,
    changeLineQuantity,
    removeLineItem,
    clearEntireCart,
  };
}
