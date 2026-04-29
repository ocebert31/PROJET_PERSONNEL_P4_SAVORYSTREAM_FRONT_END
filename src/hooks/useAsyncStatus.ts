import { useCallback, useMemo, useState } from "react";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export function useAsyncStatus(initialStatus: AsyncStatus = "idle") {
  const [status, setStatus] = useState<AsyncStatus>(initialStatus);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const startLoading = useCallback((clearError = true) => {
    setStatus("loading");
    if (clearError) {
      setErrorMessage(undefined);
    }
  }, []);

  const setSuccess = useCallback(() => {
    setStatus("success");
  }, []);

  const setError = useCallback((message: string) => {
    setErrorMessage(message);
    setStatus("error");
  }, []);

  const reset = useCallback((nextStatus: AsyncStatus = "idle") => {
    setStatus(nextStatus);
    setErrorMessage(undefined);
  }, []);

  return useMemo(
    () => ({
      status, errorMessage, setErrorMessage, setStatus, startLoading, setSuccess,
      setError, reset, 
      isIdle: status === "idle", isLoading: status === "loading",
      isSuccess: status === "success", isError: status === "error",
      isBusy: status === "idle" || status === "loading",
    }),
    [status, errorMessage, startLoading, setSuccess, setError, reset],
  );
}
