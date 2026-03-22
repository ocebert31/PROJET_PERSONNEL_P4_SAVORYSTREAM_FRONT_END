/** Prix affiché à partir du premier conditionnement (catalogue, grille produit). */
export function formatPrimaryPriceLabel(sauce: { conditionnements?: { prix?: number }[] }): string {
  const price = sauce.conditionnements?.[0]?.prix;
  return price !== undefined && price !== null ? `${Number(price).toFixed(2)} €` : "N/A €";
}
