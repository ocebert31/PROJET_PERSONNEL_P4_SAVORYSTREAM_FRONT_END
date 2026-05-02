import { fetchSessionRequest } from "../users/authentication";
import type { CartMutationResponse, CartShowResponse } from "../../types/cart";

export async function fetchCart(): Promise<CartShowResponse> {
  return fetchSessionRequest<CartShowResponse>("carts", { method: "GET" });
}

export async function addCartItem( sauceId: string, conditioningId: string, quantity: number ): Promise<CartMutationResponse> {
  return fetchSessionRequest<CartMutationResponse>("carts/items", {
    method: "POST",
    body: { sauce_id: sauceId, conditioning_id: conditioningId, quantity },
  });
}

export async function updateCartItemQuantity(lineId: string, quantity: number): Promise<CartMutationResponse> {
  const encodedId = encodeURIComponent(lineId);
  return fetchSessionRequest<CartMutationResponse>(`carts/items/${encodedId}`, {
    method: "PATCH",
    body: { quantity },
  });
}

export async function removeCartItem(lineId: string): Promise<CartMutationResponse> {
  const encodedId = encodeURIComponent(lineId);
  return fetchSessionRequest<CartMutationResponse>(`carts/items/${encodedId}`, {
    method: "DELETE",
  });
}

export async function clearCart(): Promise<CartMutationResponse> {
  return fetchSessionRequest<CartMutationResponse>("carts", {
    method: "DELETE",
  });
}
