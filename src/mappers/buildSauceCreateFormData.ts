import type { SauceCreateFormValues } from "../schemas/sauceCreateSchema";
import { appendSauceFormData } from "./appendSauceFormData";

export function buildSauceCreateFormData(values: SauceCreateFormValues): FormData {
  const data = new FormData();

  appendSauceFormData(data, values);

  values.conditionings.forEach((conditioning) => {
    data.append("conditionings[][volume]", conditioning.volume.trim());
    data.append("conditionings[][price]", conditioning.price.trim());
  });

  values.ingredients.forEach((ingredient) => {
    data.append("ingredients[][name]", ingredient.name.trim());
    data.append("ingredients[][quantity]", ingredient.quantity.trim());
  });

  return data;
}
