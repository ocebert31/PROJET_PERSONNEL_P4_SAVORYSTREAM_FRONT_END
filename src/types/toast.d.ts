export type ToastVariant = "success" | "error";

export type ToastItem = {
    id: string;
    variant: ToastVariant;
    message: string;
};

export type ToastContextValue = {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
};

export type ToastStackProps = {
    toasts: ToastItem[];
    onDismiss: (id: string) => void;
};