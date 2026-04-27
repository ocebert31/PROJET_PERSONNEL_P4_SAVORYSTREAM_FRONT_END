import type { SauceEditFormSlice } from "../types/sauce";
import { appendSauceFormData } from "./appendSauceFormData";

export function buildSauceEditFormData(values: SauceEditFormSlice): FormData {
  const data = new FormData();
  appendSauceFormData(data, values);
  return data;
}
