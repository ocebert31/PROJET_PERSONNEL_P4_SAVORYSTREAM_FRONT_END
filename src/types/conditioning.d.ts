import type { FieldArrayWithId, FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form";
import type { SauceConditioningListFormSlice } from "../schemas/sauceCreateSchema";
import type { SauceEditFormValues } from "../schemas/sauceUpdateSchema";
import type { SauceMutationSuccessResponse } from "./sauce";

export type ListMode = "create" | "edit";

export interface Conditioning {
  id: string;
  volume: string;
  prix: number;
  stock?: number;
}

export interface SauceConditioningUpdatePayload {
  volume?: string;
  price?: number | string;
  version?: number;
}

export interface SauceConditioningCreatePayload {
  volume: string;
  price: string | number;
}

export interface SauceConditioningMutationResponse extends SauceMutationSuccessResponse {
  conditioning?: { id: string; volume: string; price: string };
}

export type ConditioningFieldsSectionProps = {
  register: UseFormRegister<SauceConditioningListFormSlice>;
  errors: FieldErrors<SauceConditioningListFormSlice>;
  fields: FieldArrayWithId<SauceConditioningListFormSlice, "conditionings", "id">[];
  onAppend: () => void;
  onRemove: (index: number) => void;
  mode?: ListMode;
  onDeletePersistedRow?: (index: number) => void | Promise<void>;
  listActionsDisabled?: boolean;
  deletingRowIndex?: number | null;
};

export type UseEditSauceConditioningsArgs = {
  sauceId: string;
  getValues: UseFormGetValues<SauceEditFormValues>;
  removeConditioning: (index: number) => void;
};

export type EditSauceConditioningRows = SauceEditFormValues["conditionings"];
