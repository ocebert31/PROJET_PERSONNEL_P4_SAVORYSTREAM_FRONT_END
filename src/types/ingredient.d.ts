import type { FieldArrayWithId, FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form";
import type { SauceIngredientListFormSlice } from "../schemas/sauceCreateSchema";
import type { SauceEditFormValues } from "../schemas/sauceUpdateSchema";
import type { SauceMutationSuccessResponse } from "./sauce";

export type ListMode = "create" | "edit";

export interface Ingredient {
  id: string;
  name: string;
  quantité: string;
}

export interface SauceIngredientUpdatePayload {
  name?: string;
  quantity?: string;
  version?: number;
}

export interface SauceIngredientCreatePayload {
  name: string;
  quantity: string;
}

export interface SauceIngredientMutationResponse extends SauceMutationSuccessResponse {
  ingredient?: { id: string; name: string; quantity: string };
}

export type IngredientFieldsSectionProps = {
  register: UseFormRegister<SauceIngredientListFormSlice>;
  errors: FieldErrors<SauceIngredientListFormSlice>;
  fields: FieldArrayWithId<SauceIngredientListFormSlice, "ingredients", "id">[];
  onAppend: () => void;
  onRemove: (index: number) => void;
  mode?: ListMode;
  onDeletePersistedRow?: (index: number) => void | Promise<void>;
  listActionsDisabled?: boolean;
  deletingRowIndex?: number | null;
};

export type UseEditSauceIngredientsArgs = {
  sauceId: string;
  getValues: UseFormGetValues<SauceEditFormValues>;
  removeIngredient: (index: number) => void;
};

export type EditSauceIngredientRows = SauceEditFormValues["ingredients"];
