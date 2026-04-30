import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { SauceCategory } from "../types/sauceCategory";
import { useDeleteCategory } from "./useDeleteCategory";

type CategoryRowActionProps = {
  editTo: string;
  editLabel: string;
  deleteItemName: string;
  deleteId: string;
  onDeleteById: (id: string) => Promise<boolean> | boolean;
  onDeleteSuccess: (id: string) => void;
  onOpenDeleteConfirm: () => void;
  isDeleting: boolean;
};

type UseCategoryRowActionsResult = {
  deleteErrorMessage: string;
  clearDeleteError: () => void;
  getCategoryRowActionProps: (category: SauceCategory) => CategoryRowActionProps;
};

export function useCategoryRowActions(
  setCategories: Dispatch<SetStateAction<SauceCategory[]>>,
): UseCategoryRowActionsResult {
  const { deleteCategoryById, deletingCategoryId, deleteErrorMessage, clearDeleteError } = useDeleteCategory();

  const handleDeleteSuccess = useCallback((deletedId: string) => {
    setCategories((currentCategories) => currentCategories.filter((item) => item.id !== deletedId));
  }, [setCategories]);

  const getCategoryRowActionProps = useCallback((category: SauceCategory): CategoryRowActionProps => ({
    editTo: `/dashboard/categories/${category.id}/edit`,
    editLabel: `Editer la catégorie ${category.name}`,
    deleteItemName: `la catégorie ${category.name}`,
    deleteId: category.id,
    onDeleteById: deleteCategoryById,
    onDeleteSuccess: handleDeleteSuccess,
    onOpenDeleteConfirm: clearDeleteError,
    isDeleting: deletingCategoryId === category.id,
  }), [clearDeleteError, deleteCategoryById, deletingCategoryId, handleDeleteSuccess]);

  return {
    deleteErrorMessage,
    clearDeleteError,
    getCategoryRowActionProps,
  };
}
