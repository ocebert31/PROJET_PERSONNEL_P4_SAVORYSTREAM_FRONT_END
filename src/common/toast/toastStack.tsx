import { ToastItemView } from "../../common/toast/toastItemView";
import type { ToastStackProps } from "../../types/toast";

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
    return (
        <div className="pointer-events-none fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 sm:left-auto sm:right-4 sm:max-w-sm sm:w-full" aria-live="polite">
            {toasts.map((t) => (
                <ToastItemView key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>
    );
}