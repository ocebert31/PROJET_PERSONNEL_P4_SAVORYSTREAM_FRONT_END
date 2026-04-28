import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../../common/button/button";
import EntityRowActions from "../../../common/button/EntityRowActions";
import { fetchAdminCategories } from "../../../services/sauces/category/categoryService";
import type { SauceCategory } from "../../../types/sauceCategory";
import { useDeleteCategory } from "../../../hooks/useDeleteCategory";
import { toErrorMessage } from "../../../utils/errorMessage";

type LoadStatus = "idle" | "loading" | "success" | "error";

function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<SauceCategory[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { deleteCategoryById, deletingCategoryId, deleteErrorMessage, clearDeleteError } = useDeleteCategory();

  const loadCategories = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    clearDeleteError();
    try {
      const list = await fetchAdminCategories();
      setCategories(list);
      setStatus("success");
    } catch (error) {
      setCategories([]);
      setErrorMessage(toErrorMessage(error, "Impossible de charger les catégories."));
      setStatus("error");
    }
  }, [clearDeleteError]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14" aria-busy={status === "loading" || status === "idle"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wider text-primary">Administration</p>
          <h1 className="text-heading-1 mt-2 text-foreground">Catégories</h1>
          <p className="text-body-sm mt-3 text-muted">Consultez les catégories existantes et mettez-les à jour.</p>
        </div>
        <NavLink to="/dashboard/categories/create" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          Créer une catégorie
        </NavLink>
      </div>

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

      {deleteErrorMessage ? (
        <p className="text-body-sm mt-4 text-destructive">{deleteErrorMessage}</p>
      ) : null}

      {status === "success" ? (
        <div className="mt-8">
          <h2 className="text-label text-foreground">Liste des catégories</h2>
          {categories.length === 0 ? (
            <p className="text-body-sm mt-2 text-muted">Aucune catégorie trouvée.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center gap-4 rounded-xl border border-border/70 bg-surface px-4 py-3 text-sm text-foreground">
                  <span className="flex-1">{category.name}</span>
                  <EntityRowActions editTo={`/dashboard/categories/${category.id}/edit`} editLabel={`Editer la catégorie ${category.name}`}
                    deleteItemName={`la catégorie ${category.name}`} deleteId={category.id} onDeleteById={deleteCategoryById}
                    onDeleteSuccess={(deletedId) =>
                      setCategories((currentCategories) => currentCategories.filter((item) => item.id !== deletedId))
                    } onOpenDeleteConfirm={clearDeleteError} isDeleting={deletingCategoryId === category.id}
                  />
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
