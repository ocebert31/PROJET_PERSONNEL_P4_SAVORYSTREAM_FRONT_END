import * as yup from "yup";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const PRICE_REGEX = /^\d+(\.\d{1,2})?$/;
const INVALID_PRICE_MESSAGE = "Prix invalide (ex. 6.90).";
const MAX_LENGTH_MESSAGE_SUFFIX = "caractères maximum.";

const requiredTrimmedString = (requiredMessage: string) => yup.string().trim().required(requiredMessage);

const requiredTrimmedStringWithMax = (
  requiredMessage: string,
  maxLength: number,
  maxMessage = `${maxLength} ${MAX_LENGTH_MESSAGE_SUFFIX}`,
) => requiredTrimmedString(requiredMessage).max(maxLength, maxMessage);

const createEmptyConditioningRow = () => ({ volume: "", price: "" });
const createEmptyIngredientRow = () => ({ name: "", quantity: "" });

const conditioningRowSchema = yup.object({
  volume: requiredTrimmedStringWithMax("Le volume est requis.", 20, "20 caractères max."),
  price: requiredTrimmedString("Le prix est requis.").matches(PRICE_REGEX, INVALID_PRICE_MESSAGE),
  serverId: yup.string().optional(),
});

const ingredientRowSchema = yup.object({
  name: requiredTrimmedStringWithMax("Le nom de l’ingrédient est requis.", 100),
  quantity: requiredTrimmedStringWithMax("La quantité de l’ingrédient est requise.", 100),
  serverId: yup.string().optional(),
});

export const baseCoreFieldsSchema = yup.object({
  name: requiredTrimmedStringWithMax("Le nom est requis.", 50),
  tagline: requiredTrimmedStringWithMax("L’accroche est requise.", 120),
  description: requiredTrimmedString("La description est requise.").max(5000, "Texte trop long.").default(""),
  characteristic: requiredTrimmedStringWithMax("La caractéristique est requise.", 255).default(""),
  is_available: yup.boolean().required("Disponibilité requise."),
  category_id: yup.string().required("Choisissez une catégorie."),
  stock_quantity: yup
    .number()
    .typeError("Quantité invalide.")
    .integer("Entier uniquement.")
    .min(0, "Minimum 0.")
    .required("Stock requis."),
});

function buildImageSchema({ required }: { required: boolean }) {
  return yup
    .mixed<FileList>()
    .optional()
    .test("required", "L’image est requise.", (value) => {
      if (!required) return true;
      return !!value && value.length > 0;
    })
    .test("file-size", "Image trop volumineuse (max 5 Mo).", (value) => {
      if (!value || value.length === 0) return !required;
      return value[0].size <= MAX_IMAGE_SIZE_BYTES;
    })
    .test("file-type", "Format d'image non supporté.", (value) => {
      if (!value || value.length === 0) return !required;
      return value[0].type.startsWith("image/");
    });
}

function buildNonEmptyArrayField<TSchema extends yup.Schema>(
  rowSchema: TSchema,
  message: string,
) {
  return yup.array().of(rowSchema).min(1, message).required(message);
}

export const conditioningsFieldSchema = buildNonEmptyArrayField(
  conditioningRowSchema,
  "Ajoutez au moins un conditionnement.",
);

export const ingredientsFieldSchema = buildNonEmptyArrayField(
  ingredientRowSchema,
  "Ajoutez au moins un ingrédient.",
);

export const sauceCreateSchema = baseCoreFieldsSchema.shape({
  image: buildImageSchema({ required: true }),
  conditionings: conditioningsFieldSchema,
  ingredients: ingredientsFieldSchema,
});

export const SauceCreateSchema = () => sauceCreateSchema;

export type SauceCreateFormValues = yup.InferType<typeof sauceCreateSchema>;

/** Narrow slices shared by create and edit list UIs for `react-hook-form` typing. */
export type SauceConditioningListFormSlice = Pick<SauceCreateFormValues, "conditionings">;

export type SauceIngredientListFormSlice = Pick<SauceCreateFormValues, "ingredients">;

export const sauceCreateDefaultValues: SauceCreateFormValues = {
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
