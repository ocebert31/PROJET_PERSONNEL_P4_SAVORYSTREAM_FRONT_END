import { useCallback, useState } from "react";
import { deleteSauce } from "../services/sauces/sauceService";
import { toErrorMessage } from "../utils/errorMessage";

type UseDeleteSauceResult = {
  deletingSauceId: string | null;
  deleteErrorMessage: string;
  clearDeleteError: () => void;
  deleteSauceById: (sauceId: string) => Promise<boolean>;
};

export function useDeleteSauce(): UseDeleteSauceResult {
  const [deletingSauceId, setDeletingSauceId] = useState<string | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string>("");

  const clearDeleteError = useCallback(() => {
    setDeleteErrorMessage("");
  }, []);

  const deleteSauceById = useCallback(async (sauceId: string) => {
    setDeleteErrorMessage("");
    setDeletingSauceId(sauceId);
    try {
      await deleteSauce(sauceId);
      return true;
    } catch (error) {
      setDeleteErrorMessage(toErrorMessage(error, "Suppression impossible."));
      return false;
    } finally {
      setDeletingSauceId(null);
    }
  }, []);

  return {
    deletingSauceId,
    deleteErrorMessage,
    clearDeleteError,
    deleteSauceById,
  };
}
