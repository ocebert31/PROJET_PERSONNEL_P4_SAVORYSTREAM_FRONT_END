import { useContext } from "react";
import { ToastContext } from "../context/toastContext";
import type { ToastContextValue } from "../types/toast";

const noop: ToastContextValue = {
    showSuccess: () => {},
    showError: () => {},
};

export function useToast(): ToastContextValue {
    return useContext(ToastContext) ?? noop;
}
