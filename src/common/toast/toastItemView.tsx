import type { ToastItem, ToastVariant } from "../../types/toast";
import IconButton from "../button/IconButton";

const VARIANT_STYLES: Record<ToastVariant, string> = {
    success: "status-alert-success",
    error: "status-alert-destructive",
};

export function ToastItemView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
    return (
        <div role={toast.variant === "error" ? "alert" : "status"} className={`ds-toast-shadow pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 text-sm transition-opacity duration-300 ${VARIANT_STYLES[toast.variant]}`} >
            <p className="min-w-0 flex-1 leading-snug">{toast.message}</p>
            <IconButton type="button" variant="ghost" size="sm" onClick={() => onDismiss(toast.id)} aria-label="Fermer la notification">
                ×
            </IconButton>
        </div>
    );
}
