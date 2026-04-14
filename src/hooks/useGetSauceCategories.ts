import { useEffect, useState } from "react";
import { fetchAdminCategories } from "../services/sauces/category/categoryService";
import type { Sauce_category } from "../types/Sauce_category";
import { useToast } from "./useToast";

type UseGetSauceCategoriesResult = {
  error: string | null;
  selectOptions: { value: string; label: string }[];
  categoriesBlocked: boolean;
};


export function useGetSauceCategories(): UseGetSauceCategoriesResult {
  const { showError } = useToast();
  const [categories, setCategories] = useState<Sauce_category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchAdminCategories();
        if (!cancelled) {
          setCategories(list);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Impossible de charger les catégories.";
          setError(msg);
          showError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showError]);

  const selectOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return {
    error,
    selectOptions,
    categoriesBlocked: loading || !!error,
  };
}
