import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import type { ToastContextValue } from "../types/Toast";

const noop: ToastContextValue = {
    showSuccess: () => {},
    showError: () => {},
};

export function useToast(): ToastContextValue {
    return useContext(ToastContext) ?? noop;
}
