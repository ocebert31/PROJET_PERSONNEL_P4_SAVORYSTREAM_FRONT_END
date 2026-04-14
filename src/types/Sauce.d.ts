import { Dispatch, SetStateAction } from "react";
import type { SauceCreateFormValues } from "../schemas/sauceCreateSchema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";  

export interface Sauce {
  id: number;
  name: string;
  description: string;
  caracteristique?: string;
  is_available?: boolean;
  image_url: string;
  conditionnements: Conditioning[];
  ingredients?: Ingredient[];
  accroche?: string;
}

export interface Conditioning {
  id: number;
  volume: string;
  prix: number;
  stock?: number;
}

export interface Ingredient {
  id: number;
  name: string;
  quantité: string;
}

export interface SauceItem {
  sauceId: number;
  condId: number;
  name: string;
  volume: number;
  prix: number;
  quantity: number;
}

export interface ProductVariantsProps {
  variants: Conditioning[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  isAvailable?: boolean;
}

export interface AddToCartProps {
  sauce: Sauce;
  selected: Conditioning | null;
  quantity: number;
}

export interface SauceTabsProps {
  caracteristique?: string;
  ingredients?: Ingredient[];
}

export interface SauceBuySectionProps {
  sauce: Sauce;
  selected: Conditioning;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
}

export type SauceDetailPurchasePanelProps = {
  sauce: Sauce;
  selected: Conditioning | undefined;
  selectedCond: number | null;
  quantity: number;
  setSelectedCond: Dispatch<SetStateAction<number | null>>;
  setQuantity: Dispatch<SetStateAction<number>>;
};

export interface SauceApiSerialized {
  id: string;
  name: string;
  tagline: string;
  description: string | null;
  characteristic: string | null;
  image_url: string | null;
  is_available: boolean;
  category: { id: string; name: string } | null;
  stock: { id: string; quantity: number } | null;
  conditionings: Array<{ id: string; volume: string; price: string }>;
  ingredients: Array<{ id: string; name: string; quantity: string }>;
  created_at: string;
  updated_at: string;
}

export interface SauceCreateResponse {
  message: string;
  sauce: SauceApiSerialized;
}

export type SauceIdentityFieldsProps = {
  register: UseFormRegister<SauceCreateFormValues>;
  errors: FieldErrors<SauceCreateFormValues>;
};