import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import EntityRowActions from "../../../common/button/entityRowActions";
import AsyncStateView from "../../../common/feedback/asyncStateView";
import InlineErrorMessage from "../../../common/feedback/inlineErrorMessage";
import DashboardPageLayout from "../../../common/layout/dashboardPageLayout";
import { fetchAdminCategories } from "../../../services/sauces/category/categoryService";
import type { SauceCategory } from "../../../types/sauceCategory";
import { useCategoryRowActions } from "../../../hooks/useCategoryRowActions";
import { toErrorMessage } from "../../../utils/errorMessage";
import { useAsyncStatus } from "../../../hooks/useAsyncStatus";

function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<SauceCategory[]>([]);
  const { errorMessage, setErrorMessage, startLoading, setSuccess, setError, isBusy, isSuccess, isError } = useAsyncStatus("idle");
  const { deleteErrorMessage, clearDeleteError, getCategoryRowActionProps } = useCategoryRowActions(setCategories);

  const loadCategories = useCallback(async () => {
    startLoading(false);
    setErrorMessage("");
    clearDeleteError();
    try {
      const list = await fetchAdminCategories();
      setCategories(list);
      setSuccess();
    } catch (error) {
      setCategories([]);
      setError(toErrorMessage(error, "Impossible de charger les catégories."));
    }
  }, [clearDeleteError, setError, setErrorMessage, setSuccess, startLoading]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return (
    <DashboardPageLayout title="Catégories" description="Consultez les catégories existantes et mettez-les à jour." isBusy={isBusy}
      action={
        <NavLink to="/dashboard/categories/create" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          Créer une catégorie
        </NavLink>}>
      <AsyncStateView isLoading={isBusy} isError={isError} loadingLabel="Chargement des catégories..." errorMessage={errorMessage} onRetry={() => void loadCategories()}/>
      {deleteErrorMessage ? (
        <InlineErrorMessage className="mt-4">{deleteErrorMessage}</InlineErrorMessage>
      ) : null}
      {isSuccess ? (
        <div className="mt-8">
          <h2 className="text-label text-foreground">Liste des catégories</h2>
          {categories.length === 0 ? (
            <p className="text-body-sm mt-2 text-muted">Aucune catégorie trouvée.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center gap-4 rounded-xl border border-border/70 bg-surface px-4 py-3 text-sm text-foreground">
                  <span className="flex-1">{category.name}</span>
                  <EntityRowActions {...getCategoryRowActionProps(category)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </DashboardPageLayout>
  );
}

export default DashboardCategoriesPage;
