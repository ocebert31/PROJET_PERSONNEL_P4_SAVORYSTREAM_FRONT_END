import { useCallback, useState } from "react";
import { deleteAdminCategory } from "../services/sauces/category/categoryService";
import { toErrorMessage } from "../utils/errorMessage";

type UseDeleteCategoryResult = {
  deletingCategoryId: string | null;
  deleteErrorMessage: string;
  clearDeleteError: () => void;
  deleteCategoryById: (categoryId: string) => Promise<boolean>;
};

export function useDeleteCategory(): UseDeleteCategoryResult {
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  const clearDeleteError = useCallback(() => {
    setDeleteErrorMessage("");
  }, []);

  const deleteCategoryById = useCallback(async (categoryId: string) => {
    setDeleteErrorMessage("");
    setDeletingCategoryId(categoryId);
    try {
      await deleteAdminCategory(categoryId);
      return true;
    } catch (error) {
      setDeleteErrorMessage(toErrorMessage(error, "Suppression impossible."));
      return false;
    } finally {
      setDeletingCategoryId(null);
    }
  }, []);

  return {
    deletingCategoryId,
    deleteErrorMessage,
    clearDeleteError,
    deleteCategoryById,
  };
}
