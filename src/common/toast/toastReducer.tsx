import type { ToastItem } from "../../types/toast";

/** Nombre max de toasts affichés en même temps (les plus anciens sont retirés). */
export const MAX_TOASTS = 5;

export type ToastAction =
    | { type: "ADD"; payload: ToastItem }
    | { type: "REMOVE"; id: string };

export function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
    switch (action.type) {
        case "ADD":
            return [...state.slice(-(MAX_TOASTS - 1)), action.payload];
        case "REMOVE":
            return state.filter((t) => t.id !== action.id);
        default:
            return state;
    }
}
