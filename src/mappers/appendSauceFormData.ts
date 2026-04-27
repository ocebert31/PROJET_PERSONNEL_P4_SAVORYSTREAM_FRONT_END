import type { SauceFormDataInput } from "../types/sauce";

export function appendSauceFormData(data: FormData, values: SauceFormDataInput): void {
  data.append("name", values.name.trim());
  data.append("tagline", values.tagline.trim());
  data.append("is_available", String(values.is_available));
  data.append("category_id", values.category_id.trim());
  data.append("stock[quantity]", String(values.stock_quantity));
  data.append("description", values.description.trim());
  data.append("characteristic", values.characteristic.trim());

  const image = values.image?.[0];
  if (image) {
    data.append("image", image);
  }
}
