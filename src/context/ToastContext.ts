import { createContext } from "react";
import type { ToastContextValue } from "../types/Toast";

export const ToastContext = createContext<ToastContextValue | null>(null);
