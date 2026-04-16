import type { SauceCreateFormValues } from "../schemas/sauceCreateSchema";

/**
 * Transforme les valeurs du formulaire (création sauce admin) en FormData multipart.
 */
export function buildSauceCreatePayload(values: SauceCreateFormValues): FormData {
  const data = new FormData();

  data.append("name", values.name.trim());
  data.append("tagline", values.tagline.trim());
  data.append("is_available", String(values.is_available));
  data.append("category_id", values.category_id);
  data.append("stock[quantity]", String(values.stock_quantity));

  data.append("description", values.description.trim());
  data.append("characteristic", values.characteristic.trim());

  const image = values.image?.[0];
  if (image) data.append("image", image);

  // Use [] notation so Rails parses nested arrays from multipart payloads.
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
