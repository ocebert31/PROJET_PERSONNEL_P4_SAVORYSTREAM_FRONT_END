import { useCallback, useState } from "react";
import type { EditSauceIngredientRows, UseEditSauceIngredientsArgs } from "../types/ingredient";
import { createSauceIngredient, deleteSauceIngredient, updateSauceIngredient } from "../services/sauces/sauceService";

export function useEditSauceIngredients({ sauceId, getValues, removeIngredient }: UseEditSauceIngredientsArgs) {
  const [pendingIngredientDeletes, setPendingIngredientDeletes] = useState<string[]>([]);

  const resetPendingIngredientDeletes = useCallback(() => {
    setPendingIngredientDeletes([]);
  }, []);

  const deleteIngredientRow = useCallback(
    (index: number) => {
      const row = getValues(`ingredients.${index}`);
      const serverId = row.serverId?.trim();
      if (!serverId) {
        removeIngredient(index);
        return;
      }
      setPendingIngredientDeletes((current) =>
        current.includes(serverId) ? current : [...current, serverId],
      );
      removeIngredient(index);
    },
    [getValues, removeIngredient],
  );

  const applyIngredientDeletes = useCallback(async () => {
    for (const ingredientId of pendingIngredientDeletes) {
      await deleteSauceIngredient(sauceId, ingredientId);
    }
  }, [pendingIngredientDeletes, sauceId]);

  const syncIngredientRows = useCallback(
    async (rows: EditSauceIngredientRows) => {
      for (const row of rows) {
        const serverId = row.serverId?.trim();
        const name = row.name?.trim() ?? "";
        const quantity = row.quantity?.trim() ?? "";

        if (serverId) {
          await updateSauceIngredient(sauceId, serverId, { name: row.name, quantity: row.quantity });
          continue;
        }
        if (name && quantity) {
          await createSauceIngredient(sauceId, { name, quantity });
        }
      }
    },
    [sauceId],
  );

  return { deleteIngredientRow, applyIngredientDeletes, syncIngredientRows, resetPendingIngredientDeletes };
}
