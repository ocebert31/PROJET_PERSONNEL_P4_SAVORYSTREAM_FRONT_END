import { useState, useMemo, useEffect, useCallback } from "react";
import type { Conditioning, Sauce } from "../types/sauce";
import { sauceMapper } from "../mappers/sauce.mapper";
import { fetchSauce } from "../services/sauces/sauceService";
import { ApiError } from "../services/apiRequest/apiError";

export function errorMessageFromUnknown(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error) return e.message;
  return "Impossible de charger la sauce.";
}

export function isBlankSauceId(id: string | undefined): boolean {
  return !id?.trim();
}

/** Returns the packaging id with the smallest numeric volume, or null when the list is empty. */
export function defaultConditioningId(conditionnements: Conditioning[]): string | null {
  if (conditionnements.length === 0) return null;
  const smallest = conditionnements.reduce((min, cond) =>
    parseFloat(cond.volume) < parseFloat(min.volume) ? cond : min
  );
  return smallest.id;
}

export function useSauceDetailQuery(id: string | undefined) {
  const [sauce, setSauce] = useState<Sauce | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(() => !isBlankSauceId(id));
  const [error, setError] = useState<string | undefined>(undefined);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const sauceId = id?.trim() ?? "";
    if (!sauceId) {
      setSauce(undefined);
      setError(undefined);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(undefined);
    setSauce(undefined);

    const load = async () => {
      try {
        const { sauce: apiSauce } = await fetchSauce(sauceId);
        if (cancelled) return;
        setSauce(sauceMapper(apiSauce));
        setError(undefined);
      } catch (e) {
        if (cancelled) return;
        setSauce(undefined);
        if (e instanceof ApiError && e.status === 404) {
          setError(undefined);
        } else {
          setError(errorMessageFromUnknown(e));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [id, loadAttempt]);

  const retry = useCallback(() => {
    if (!isBlankSauceId(id)) {
      setLoadAttempt((n) => n + 1);
    }
  }, [id]);

  return { sauce, isLoading, error, retry };
}

export function useSaucePurchaseSelection(sauce: Sauce | undefined) {
  const defaultCondId = useMemo(
    () => (sauce ? defaultConditioningId(sauce.conditionnements) : null),
    [sauce]
  );

  const [selectedCond, setSelectedCond] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedCond(defaultCondId);
    setQuantity(1);
  }, [defaultCondId]);

  const selected = useMemo(
    () => sauce?.conditionnements.find((c) => c.id === selectedCond),
    [sauce, selectedCond]
  );

  return { selected, selectedCond, setSelectedCond, quantity, setQuantity };
}

export function useSauceDetail(id: string | undefined) {
  const { sauce, isLoading, error, retry } = useSauceDetailQuery(id);
  const purchase = useSaucePurchaseSelection(sauce);
  return { sauce, isLoading, error, retry, ...purchase };
}
