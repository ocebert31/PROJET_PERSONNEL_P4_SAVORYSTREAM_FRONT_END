import { Dispatch, SetStateAction } from "react";

interface Sauce {
  id: number;
  name: string;
  description: string;
  caracteristique?: string;
  is_available?: boolean;
  image_url: string;
  conditionnements: Conditioning[];
  ingredients?: Ingredient[];
}

interface Conditioning {
  id: number;
  volume: string;
  prix: number;
  stock?: number;
}

interface Ingredient {
  id: number;
  name: string;
  quantité: string;
}

interface SauceItem {
  sauceId: number;
  condId: number;
  name: string;
  volume: number;
  prix: number;
  quantity: number;
}

interface ProductVariantsProps {
  variants: Conditioning[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  isAvailable?: boolean;
}

interface AddToCartProps {
  sauce: Sauce
  selected: Conditioning | null;
  quantity: number
}

interface SauceTabsProps {
  caracteristique?: string;
  ingredients?: Ingredient[];
}

interface SauceBuySectionProps {
  sauce: Sauce;
  selected: Conditioning;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
}