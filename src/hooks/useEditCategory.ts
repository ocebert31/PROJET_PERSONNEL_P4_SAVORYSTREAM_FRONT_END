import { useCallback, useState } from "react";
import { updateAdminCategory } from "../services/sauces/category/categoryService";
import type { SauceCategory } from "../types/sauceCategory";
import { toErrorMessage } from "../utils/errorMessage";

type UseEditCategoryResult = {
  editingCategoryId: string | null;
  editErrorMessage: string;
  clearEditError: () => void;
  editCategoryById: (categoryId: string, name: string) => Promise<SauceCategory | null>;
};

export function useEditCategory(): UseEditCategoryResult {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const clearEditError = useCallback(() => {
    setEditErrorMessage("");
  }, []);

  const editCategoryById = useCallback(async (categoryId: string, name: string) => {
    setEditErrorMessage("");
    setEditingCategoryId(categoryId);
    try {
      const result = await updateAdminCategory(categoryId, name);
      return result.category;
    } catch (error) {
      setEditErrorMessage(toErrorMessage(error, "Mise à jour impossible."));
      return null;
    } finally {
      setEditingCategoryId(null);
    }
  }, []);

  return {
    editingCategoryId,
    editErrorMessage,
    clearEditError,
    editCategoryById,
  };
}
