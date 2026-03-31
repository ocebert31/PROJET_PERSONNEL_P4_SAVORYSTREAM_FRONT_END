import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { ToastContext } from "../../context/ToastContext";
import { ToastStack } from "./ToastStack";
import { toastReducer } from "./ToastReducer";
import type { ToastContextValue, ToastItem, ToastVariant } from "../../types/Toast";

const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, dispatch] = useReducer(toastReducer, []);

    const dismissTimersRef = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        const timers = dismissTimersRef.current;
        return () => {
            for (const timer of timers.values()) {
                clearTimeout(timer);
            }
            timers.clear();
        };
    }, []);

    const removeToast = useCallback((id: string) => {
        const timer = dismissTimersRef.current.get(id);
        if (timer !== undefined) {
            clearTimeout(timer);
            dismissTimersRef.current.delete(id);
        }
        dispatch({ type: "REMOVE", id });
    }, []);

    const enqueue = useCallback((variant: ToastVariant, message: string) => {
        const id = crypto.randomUUID();
        const item: ToastItem = { id, variant, message };
        dispatch({ type: "ADD", payload: item });

        const timer = window.setTimeout(() => {
            dismissTimersRef.current.delete(id);
            dispatch({ type: "REMOVE", id });
        }, AUTO_DISMISS_MS);
        dismissTimersRef.current.set(id, timer);
    }, []);

    const value = useMemo<ToastContextValue>(
        () => ({
            showSuccess: (message: string) => enqueue("success", message),
            showError: (message: string) => enqueue("error", message),
        }),
        [enqueue],
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastStack toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}
