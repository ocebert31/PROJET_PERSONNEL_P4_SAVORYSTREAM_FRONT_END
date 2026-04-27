import * as yup from "yup";
import {
  baseCoreFieldsSchema,
  conditioningsFieldSchema,
  ingredientsFieldSchema,
} from "./sauceCreateSchema";

/** API sauce payload shape needed to hydrate edit list defaults (avoids importing `types/sauce`, which imports this module). */
export type SauceApiListsSource = {
  conditionings: Array<{ id: string; volume: string; price: string }>;
  ingredients: Array<{ id: string; name: string; quantity: string }>;
};

const createEmptyConditioningRow = () => ({ volume: "", price: "" });
const createEmptyIngredientRow = () => ({ name: "", quantity: "" });

export const sauceEditOptionalImageSchema = yup
  .mixed<FileList>()
  .optional()
  .test("file-size", "Image trop volumineuse (max 5 Mo).", (value) => {
    if (!value || value.length === 0) return true;
    return value[0].size <= 5 * 1024 * 1024;
  })
  .test("file-type", "Format d'image non supporte.", (value) => {
    if (!value || value.length === 0) return true;
    return value[0].type.startsWith("image/");
  });

export const sauceEditListsSchema = yup.object({
  conditionings: conditioningsFieldSchema,
  ingredients: ingredientsFieldSchema,
});

export const sauceEditFormSchema = baseCoreFieldsSchema.shape({
  image: sauceEditOptionalImageSchema,
  conditionings: conditioningsFieldSchema,
  ingredients: ingredientsFieldSchema,
});

export const SauceEditListsSchema = () => sauceEditListsSchema;

export const SauceEditFormSchema = () => sauceEditFormSchema;

export type SauceEditFormValues = yup.InferType<typeof sauceEditFormSchema>;

/** @deprecated Utiliser {@link SauceEditFormValues} (champs `conditionings` / `ingredients` uniquement). */
export type SauceEditListsFormValues = Pick<SauceEditFormValues, "conditionings" | "ingredients">;

/** Source API minimale pour hydrater le formulaire d’édition (fiche + listes). */
export type SauceApiEditFormSource = SauceApiListsSource & {
  name: string;
  tagline: string;
  description: string | null;
  characteristic: string | null;
  is_available: boolean;
  category: { id: string; name: string } | null;
  stock: { id: string; quantity: number } | null;
};

/** Defaults for the edit-page lists form, including placeholder rows when the API returns empty arrays. */
export function buildSauceEditListsDefaultsFromApi(api: SauceApiListsSource): SauceEditListsFormValues {
  const conditionings =
    api.conditionings.length > 0
      ? api.conditionings.map((c) => ({
          serverId: c.id,
          volume: c.volume,
          price: c.price,
        }))
      : [createEmptyConditioningRow()];

  const ingredients =
    api.ingredients.length > 0
      ? api.ingredients.map((i) => ({
          serverId: i.id,
          name: i.name,
          quantity: i.quantity,
        }))
      : [createEmptyIngredientRow()];

  return { conditionings, ingredients };
}

export function buildSauceEditFormDefaultsFromApi(api: SauceApiEditFormSource): SauceEditFormValues {
  const lists = buildSauceEditListsDefaultsFromApi(api);
  return {
    name: api.name,
    tagline: api.tagline,
    description: api.description ?? "",
    characteristic: api.characteristic ?? "",
    image: undefined,
    is_available: api.is_available,
    category_id: api.category?.id ?? "",
    stock_quantity: api.stock?.quantity ?? 0,
    ...lists,
  };
}

export const emptySauceEditFormValues: SauceEditFormValues = {
  name: "",
  tagline: "",
  description: "",
  characteristic: "",
  image: undefined,
  is_available: true,
  category_id: "",
  stock_quantity: 0,
  conditionings: [createEmptyConditioningRow()],
  ingredients: [createEmptyIngredientRow()],
};
