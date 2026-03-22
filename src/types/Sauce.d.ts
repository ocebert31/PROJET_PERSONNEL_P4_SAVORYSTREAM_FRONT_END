import { Dispatch, SetStateAction } from "react";

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