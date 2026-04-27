import { useCallback, useEffect, useState } from "react";
import Button from "../../../common/button/button";
import { ApiError } from "../../../services/apiRequest/apiError";
import { fetchAdminCategories } from "../../../services/sauces/category/categoryService";
import type { SauceCategory } from "../../../types/sauceCategory";
import CreateCategoryPage from "./createCategoryPage";

type LoadStatus = "idle" | "loading" | "success" | "error";

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Impossible de charger les catégories.";
}

function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<SauceCategory[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const loadCategories = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const list = await fetchAdminCategories();
      setCategories(list);
      setStatus("success");
    } catch (error) {
      setCategories([]);
      setErrorMessage(toErrorMessage(error));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14" aria-busy={status === "loading" || status === "idle"}>
      <p className="text-caption font-semibold uppercase tracking-wider text-primary">Administration</p>
      <h1 className="text-heading-1 mt-2 text-foreground">Catégories</h1>
      <p className="text-body-sm mt-3 text-muted">Consultez les catégories existantes et ajoutez-en une nouvelle.</p>
      <CreateCategoryPage onCreated={loadCategories} />

      {status === "loading" || status === "idle" ? (
        <p className="text-body-sm mt-6 text-muted" role="status">
          Chargement des catégories...
        </p>
      ) : null}

      {status === "error" ? (
        <div className="mt-6">
          <p className="text-body-sm text-destructive">{errorMessage}</p>
          <Button variant="secondary" className="mt-3" onClick={() => void loadCategories()}>
            Réessayer
          </Button>
        </div>
      ) : null}

      {status === "success" ? (
        <div className="mt-8">
          <h2 className="text-label text-foreground">Liste des catégories</h2>
          {categories.length === 0 ? (
            <p className="text-body-sm mt-2 text-muted">Aucune catégorie trouvée.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {categories.map((category) => (
                <li key={category.id} className="rounded-xl border border-border/70 bg-surface px-4 py-3 text-sm text-foreground">
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default DashboardCategoriesPage;
