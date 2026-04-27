import { useCallback, useState } from "react";
import type { EditSauceConditioningRows, UseEditSauceConditioningsArgs } from "../types/conditioning";
import { createSauceConditioning, deleteSauceConditioning, updateSauceConditioning } from "../services/sauces/sauceService";

export function useEditSauceConditionings({ sauceId, getValues, removeConditioning }: UseEditSauceConditioningsArgs) {
  const [pendingConditioningDeletes, setPendingConditioningDeletes] = useState<string[]>([]);

  const resetPendingConditioningDeletes = useCallback(() => {
    setPendingConditioningDeletes([]);
  }, []);

  const deleteConditioningRow = useCallback(
    (index: number) => {
      const row = getValues(`conditionings.${index}`);
      const serverId = row.serverId?.trim();
      if (!serverId) {
        removeConditioning(index);
        return;
      }
      setPendingConditioningDeletes((current) =>
        current.includes(serverId) ? current : [...current, serverId],
      );
      removeConditioning(index);
    },
    [getValues, removeConditioning],
  );

  const applyConditioningDeletes = useCallback(async () => {
    for (const conditioningId of pendingConditioningDeletes) {
      await deleteSauceConditioning(sauceId, conditioningId);
    }
  }, [pendingConditioningDeletes, sauceId]);

  const syncConditioningRows = useCallback(
    async (rows: EditSauceConditioningRows) => {
      for (const row of rows) {
        const serverId = row.serverId?.trim();
        const volume = row.volume?.trim() ?? "";
        const price = row.price?.trim() ?? "";

        if (serverId) {
          await updateSauceConditioning(sauceId, serverId, { volume: row.volume, price: row.price });
          continue;
        }
        if (volume && price) {
          await createSauceConditioning(sauceId, { volume, price });
        }
      }
    },
    [sauceId],
  );

  return { deleteConditioningRow, applyConditioningDeletes, syncConditioningRows, resetPendingConditioningDeletes };
}
