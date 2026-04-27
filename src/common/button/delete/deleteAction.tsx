import { useState } from "react";
import { Trash2 } from "lucide-react";

type DeleteActionProps = {
  itemName: string;
  onConfirmDelete: () => Promise<void> | void;
  isDeleting?: boolean;
  onOpenConfirm?: () => void;
};

function DeleteAction({ itemName, onConfirmDelete, isDeleting = false, onOpenConfirm }: DeleteActionProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsConfirming(false);
            void onConfirmDelete();
          }}
          aria-label={`Confirmer la suppression de ${itemName}`}
          className="rounded-full bg-destructive px-3 py-2 text-xs font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isDeleting}
        >
          Confirmer
        </button>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          aria-label={`Annuler la suppression de ${itemName}`}
          className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-muted"
          disabled={isDeleting}
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        onOpenConfirm?.();
        setIsConfirming(true);
      }}
      aria-label={`Supprimer ${itemName}`}
      title={`Supprimer ${itemName}`}
      disabled={isDeleting}
      className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Trash2 aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
      <span className="sr-only">Supprimer</span>
    </button>
  );
}

export default DeleteAction;
