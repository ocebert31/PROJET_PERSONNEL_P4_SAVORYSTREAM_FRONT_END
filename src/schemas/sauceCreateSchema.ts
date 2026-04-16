import * as yup from "yup";

const conditioningSchema = yup.object({
  volume: yup.string().trim().required("Le volume est requis.").max(20, "20 caractères max."),
  price: yup
    .string()
    .trim()
    .required("Le prix est requis.")
    .test("decimal", "Prix invalide (ex. 6.90).", (v) => {
      if (!v) return false;
      return /^\d+(\.\d{1,2})?$/.test(v);
    }),
});

const ingredientSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Le nom de l’ingrédient est requis.")
    .max(100, "100 caractères maximum."),
  quantity: yup
    .string()
    .trim()
    .required("La quantité de l’ingrédient est requise.")
    .max(100, "100 caractères maximum."),
});

const sauceCreateSchema = yup.object({
  name: yup.string().trim().required("Le nom est requis.").max(50, "50 caractères maximum."),
  tagline: yup.string().trim().required("L’accroche est requise.").max(120, "120 caractères maximum."),
  description: yup.string().trim().required("La description est requise.").max(5000, "Texte trop long.").default(""),
  characteristic: yup.string().trim().required("La caractéristique est requise.").max(255, "255 caractères maximum.").default(""),
  image: yup
    .mixed<FileList>()
    .test("required", "L’image est requise.", (value) => !!value && value.length > 0)
    .test("file-size", "Image trop volumineuse (max 5 Mo).", (value) => {
      if (!value || value.length === 0) return false;
      return value[0].size <= 5 * 1024 * 1024;
    })
    .test("file-type", "Format d'image non supporte.", (value) => {
      if (!value || value.length === 0) return false;
      return value[0].type.startsWith("image/");
    }),
  is_available: yup.boolean().required("Disponibilité requise."),
  category_id: yup.string().required("Choisissez une catégorie."),
  stock_quantity: yup
    .number()
    .typeError("Quantité invalide.")
    .integer("Entier uniquement.")
    .min(0, "Minimum 0.")
    .required("Stock requis."),
  conditionings: yup
    .array()
    .of(conditioningSchema)
    .min(1, "Ajoutez au moins un conditionnement.")
    .required("Ajoutez au moins un conditionnement."),
  ingredients: yup
    .array()
    .of(ingredientSchema)
    .min(1, "Ajoutez au moins un ingrédient.")
    .required("Ajoutez au moins un ingrédient."),
});

export const SauceCreateSchema = () => sauceCreateSchema;

export type SauceCreateFormValues = yup.InferType<typeof sauceCreateSchema>;

export const sauceCreateDefaultValues: SauceCreateFormValues = {
  name: "",
  tagline: "",
  description: "",
  characteristic: "",
  image: undefined,
  is_available: true,
  category_id: "",
  stock_quantity: 0,
  conditionings: [ { volume: "", price: "" } ],
  ingredients: [ { name: "", quantity: "" } ],
};
