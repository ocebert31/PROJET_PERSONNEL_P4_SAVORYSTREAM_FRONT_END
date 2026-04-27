import { Dispatch, SetStateAction } from "react";
import type { SauceCreateFormValues } from "../schemas/sauceCreateSchema";
import type { SauceEditFormValues } from "../schemas/sauceUpdateSchema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";  
import type { Conditioning } from "./conditioning";
import type { Ingredient } from "./ingredient";
export type { Conditioning, SauceConditioningCreatePayload, SauceConditioningMutationResponse, SauceConditioningUpdatePayload } from "./conditioning";
export type { Ingredient, SauceIngredientCreatePayload, SauceIngredientMutationResponse, SauceIngredientUpdatePayload } from "./ingredient";

export interface Sauce {
  id: string;
  name: string;
  description: string;
  caracteristique?: string;
  is_available?: boolean;
  image_url: string;
  conditionnements: Conditioning[];
  ingredients?: Ingredient[];
  accroche?: string;
}

export interface SauceItem {
  sauceId: string;
  condId: string;
  name: string;
  volume: number;
  prix: number;
  quantity: number;
}

export interface ProductVariantsProps {
  variants: Conditioning[];
  selectedId: string | null;
  onSelect: (id: string) => void;
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
  selectedCond: string | null;
  quantity: number;
  setSelectedCond: Dispatch<SetStateAction<string | null>>;
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

export interface SauceVersioningOptions {
  version?: number;
  eTag?: string;
}

export interface SauceUpdatePayload {
  name?: string;
  tagline?: string;
  description?: string | null;
  characteristic?: string | null;
  is_available?: boolean;
  category_id?: string | null;
  stock_quantity?: number | null;
  version?: number;
}

export interface SauceMutationSuccessResponse {
  message: string;
}

export interface SauceMutationResponse extends SauceMutationSuccessResponse {
  sauce?: SauceApiSerialized;
}

export interface SauceApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
}

export interface SauceVersionConflictErrorResponse extends SauceApiErrorResponse {
  code?: "VERSION_CONFLICT" | "ETAG_MISMATCH";
  current_version?: number;
}

export type SauceFormDataInput = {
  name: string;
  tagline: string;
  description: string;
  characteristic: string;
  is_available: boolean;
  category_id: string;
  stock_quantity: number;
  image?: FileList;
};

export type SauceEditFormSlice = Pick<
  SauceEditFormValues,
  "name" | "tagline" | "description" | "characteristic" | "is_available" | "category_id" | "stock_quantity" | "image"
>;

export type SauceIdentityFieldsProps = {
  register: UseFormRegister<SauceCreateFormValues>;
  errors: FieldErrors<SauceCreateFormValues>;
  /** En édition, l’image existante peut être conservée sans nouveau fichier. */
  imageOptional?: boolean;
};

export type ImageFieldFormProps = Pick<SauceIdentityFieldsProps, "register" | "errors"> & {
  imageOptional?: boolean;
};