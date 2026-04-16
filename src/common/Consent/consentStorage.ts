export const CONSENT_STORAGE_KEY = "ss_cookie_consent";

export type ConsentStatus = "accepted" | "rejected";

export function getConsentStatus(): ConsentStatus | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

export function setConsentStatus(status: ConsentStatus): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
}

export function canRunOptionalTracking(): boolean {
  return getConsentStatus() === "accepted";
}
