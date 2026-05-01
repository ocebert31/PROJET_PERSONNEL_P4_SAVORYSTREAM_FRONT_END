import { useCallback } from "react";
import { toErrorMessage } from "../utils/errorMessage";

type UseDashboardEntityLoaderOptions<T> = {
  fetchItems: () => Promise<T[]>;
  setItems: (items: T[]) => void;
  clearTransientError: () => void;
  setErrorMessage: (message: string) => void;
  startLoading: (clearError?: boolean) => void;
  setSuccess: () => void;
  setError: (message: string) => void;
  errorFallbackMessage: string;
};

export function useDashboardEntityLoader<T>({ fetchItems, setItems,  clearTransientError, setErrorMessage, startLoading, setSuccess, setError,
  errorFallbackMessage,
}: UseDashboardEntityLoaderOptions<T>) {
  return useCallback(async () => {
    startLoading(false);
    setErrorMessage("");
    clearTransientError();
    try {
      const items = await fetchItems();
      setItems(items);
      setSuccess();
    } catch (error) {
      setItems([]);
      setError(toErrorMessage(error, errorFallbackMessage));
    }
  }, [
    clearTransientError,
    errorFallbackMessage,
    fetchItems,
    setError,
    setErrorMessage,
    setItems,
    setSuccess,
    startLoading,
  ]);
}
