import type { ToastItem, ToastVariant } from "../../types/Toast";

const VARIANT_STYLES: Record<ToastVariant, string> = {
    success: "border-emerald-200/80 bg-emerald-50 text-emerald-950",
    error: "border-rose-200 bg-rose-50 text-rose-900",
};

export function ToastItemView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
    return (
        <div role={toast.variant === "error" ? "alert" : "status"} className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg transition-opacity duration-300 ${VARIANT_STYLES[toast.variant]}`} >
            <p className="min-w-0 flex-1 leading-snug">{toast.message}</p>
            <button type="button" onClick={() => onDismiss(toast.id)} className="shrink-0 rounded-lg p-1 text-current/55 transition hover:bg-black/5 hover:text-current" aria-label="Fermer la notification">
                ×
            </button>
        </div>
    );
}