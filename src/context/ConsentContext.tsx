import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { getConsentStatus, setConsentStatus, type ConsentStatus } from "../common/Consent/consentStorage";

type ConsentContextValue = {
  status: ConsentStatus | null;
  accept: () => void;
  reject: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus | null>(() => getConsentStatus());

  const value = useMemo<ConsentContextValue>(
    () => ({
      status,
      accept: () => {
        setConsentStatus("accepted");
        setStatus("accepted");
      },
      reject: () => {
        setConsentStatus("rejected");
        setStatus("rejected");
      },
    }),
    [status],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return context;
}
