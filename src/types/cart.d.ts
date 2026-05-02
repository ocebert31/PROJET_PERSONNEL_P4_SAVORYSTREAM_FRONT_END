export interface CartLineItem {
  id: string;
  sauce_id: string;
  sauce_name: string;
  sauce_image_url: string | null;
  conditioning_id: string;
  volume: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface CartPayload {
  id: string;
  user_id: string | null;
  guest_id: string | null;
  items_count: number;
  total_amount: number;
  items: CartLineItem[];
}

export interface CartShowResponse {
  cart: CartPayload;
}

export interface CartMutationResponse {
  message: string;
  cart: CartPayload;
}
