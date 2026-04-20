import type { Conditioning, Ingredient, Sauce, SauceApiSerialized } from "../types/sauce";

const FALLBACK_IMAGE_URL = "/assets/bbq.jpg";

export function parsePriceToNumber(price: string): number {
  const n = parseFloat(price);
  return Number.isFinite(n) ? n : 0;
}

export function resolveImageUrl(url: string | null): string {
  if (url == null || url.trim() === "") {
    return FALLBACK_IMAGE_URL;
  }
  return url;
}

/**
 * Mappe la réponse JSON Rails (`SauceApiSerialized`) vers le modèle `Sauce` utilisé par l’UI.
 * Pour le catalogue de sauce et le détail de sauce.
 */
export function sauceMapper(api: SauceApiSerialized): Sauce {
  const conditionnements: Conditioning[] = api.conditionings.map((c) => ({
    id: c.id,
    volume: c.volume,
    prix: parsePriceToNumber(c.price),
  }));

  const ingredients: Ingredient[] | undefined =
    api.ingredients.length > 0
      ? api.ingredients.map((i) => ({
          id: i.id,
          name: i.name,
          quantité: i.quantity,
        }))
      : undefined;

  return {
    id: api.id,
    name: api.name,
    description: api.description?.trim() ?? "",
    caracteristique: api.characteristic?.trim() || undefined,
    is_available: api.is_available,
    image_url: resolveImageUrl(api.image_url),
    accroche: api.tagline.trim() || undefined,
    conditionnements,
    ingredients,
  };
}
