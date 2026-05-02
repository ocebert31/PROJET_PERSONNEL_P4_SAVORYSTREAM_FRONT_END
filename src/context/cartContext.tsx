import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartPayload } from "../types/cart";
import {
  addCartItem,
  clearCart as clearCartRequest,
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../services/carts/cartService";
import { useAuth } from "./authContext";
import { toErrorMessage } from "../utils/errorMessage";

type CartLoadStatus = "idle" | "loading" | "error" | "ready";

type CartContextValue = {
  cart: CartPayload | null;
  loadStatus: CartLoadStatus;
  loadError: string | null;
  refreshCart: () => Promise<void>;
  addItem: (sauceId: string, conditioningId: string, quantity: number) => Promise<void>;
  updateLineQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const cartOwnerKey = user?.id ?? "guest";

  const [cart, setCart] = useState<CartPayload | null>(null);
  const [loadStatus, setLoadStatus] = useState<CartLoadStatus>("idle");
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    setLoadStatus("loading");
    setLoadError(null);
    try {
      const { cart: next } = await fetchCart();
      setCart(next);
      setLoadStatus("ready");
    } catch (e) {
      setCart(null);
      setLoadStatus("error");
      setLoadError(toErrorMessage(e, "Impossible de charger le panier."));
    }
  }, []);

  useEffect(() => {
    setCart(null);
    void refreshCart();
  }, [cartOwnerKey, refreshCart]);

  const addItem = useCallback(async (sauceId: string, conditioningId: string, quantity: number) => {
    const { cart: next } = await addCartItem(sauceId, conditioningId, quantity);
    setCart(next);
  }, []);

  const updateLineQuantity = useCallback(async (lineId: string, quantity: number) => {
    const { cart: next } = await updateCartItemQuantity(lineId, quantity);
    setCart(next);
  }, []);

  const removeLine = useCallback(async (lineId: string) => {
    const { cart: next } = await removeCartItem(lineId);
    setCart(next);
  }, []);

  const clearCart = useCallback(async () => {
    const { cart: next } = await clearCartRequest();
    setCart(next);
  }, []);

  const value = useMemo(
    () => ({
      cart,
      loadStatus,
      loadError,
      refreshCart,
      addItem,
      updateLineQuantity,
      removeLine,
      clearCart,
    }),
    [cart, loadStatus, loadError, refreshCart, addItem, updateLineQuantity, removeLine, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé dans un CartProvider.");
  }
  return ctx;
}
