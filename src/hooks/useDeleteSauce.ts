import { useCallback, useState } from "react";
import { ApiError } from "../services/apiRequest/apiError";
import { deleteSauce } from "../services/sauces/sauceService";

type UseDeleteSauceResult = {
  deletingSauceId: string | null;
  deleteErrorMessage: string;
  clearDeleteError: () => void;
  deleteSauceById: (sauceId: string) => Promise<boolean>;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Suppression impossible.";
}

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
      setDeleteErrorMessage(toErrorMessage(error));
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
