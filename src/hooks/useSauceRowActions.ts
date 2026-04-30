import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { SauceApiSerialized } from "../types/sauce";
import { useDeleteSauce } from "./useDeleteSauce";

type SauceRowActionProps = {
  editTo: string;
  editLabel: string;
  deleteItemName: string;
  deleteId: string;
  onDeleteById: (id: string) => Promise<boolean> | boolean;
  onDeleteSuccess: (id: string) => void;
  onOpenDeleteConfirm: () => void;
  isDeleting: boolean;
};

type UseSauceRowActionsResult = {
  deleteErrorMessage: string;
  clearDeleteError: () => void;
  getSauceRowActionProps: (sauce: SauceApiSerialized) => SauceRowActionProps;
};

export function useSauceRowActions(
  setSauces: Dispatch<SetStateAction<SauceApiSerialized[]>>,
): UseSauceRowActionsResult {
  const { deleteSauceById, deletingSauceId, deleteErrorMessage, clearDeleteError } = useDeleteSauce();

  const handleDeleteSuccess = useCallback((deletedId: string) => {
    setSauces((currentSauces) => currentSauces.filter((item) => item.id !== deletedId));
  }, [setSauces]);

  const getSauceRowActionProps = useCallback((sauce: SauceApiSerialized): SauceRowActionProps => ({
    editTo: `/dashboard/sauces/${sauce.id}/edit`,
    editLabel: `Editer la sauce ${sauce.name}`,
    deleteItemName: `la sauce ${sauce.name}`,
    deleteId: sauce.id,
    onDeleteById: deleteSauceById,
    onDeleteSuccess: handleDeleteSuccess,
    onOpenDeleteConfirm: clearDeleteError,
    isDeleting: deletingSauceId === sauce.id,
  }), [clearDeleteError, deleteSauceById, deletingSauceId, handleDeleteSuccess]);

  return {
    deleteErrorMessage,
    clearDeleteError,
    getSauceRowActionProps,
  };
}
