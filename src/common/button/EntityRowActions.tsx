import { NavLink } from "react-router-dom";
import { Pencil } from "lucide-react";
import DeleteAction from "./delete/deleteAction";

type EntityRowActionsProps = {
  editTo: string;
  editLabel: string;
  deleteItemName: string;
  deleteId: string;
  onDeleteById: (id: string) => Promise<boolean> | boolean;
  onDeleteSuccess?: (id: string) => void;
  isDeleting?: boolean;
  onOpenDeleteConfirm?: () => void;
};

function EntityRowActions({
  editTo,
  editLabel,
  deleteItemName,
  deleteId,
  onDeleteById,
  onDeleteSuccess,
  isDeleting = false,
  onOpenDeleteConfirm,
}: EntityRowActionsProps) {
  const handleConfirmDelete = async () => {
    const wasDeleted = await onDeleteById(deleteId);
    if (wasDeleted) {
      onDeleteSuccess?.(deleteId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <NavLink
        to={editTo}
        aria-label={editLabel}
        title={editLabel}
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
      >
        <Pencil aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
        <span className="sr-only">Editer</span>
      </NavLink>
      <DeleteAction
        itemName={deleteItemName}
        onOpenConfirm={onOpenDeleteConfirm}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default EntityRowActions;
