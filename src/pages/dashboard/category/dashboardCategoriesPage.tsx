import { useEffect, useState } from "react";
import EntityRowActions from "../../../common/button/entityRowActions";
import AsyncStateView from "../../../common/feedback/asyncStateView";
import InlineErrorMessage from "../../../common/feedback/inlineErrorMessage";
import DashboardCreateActionLink from "../../../common/section/dashboardCreateActionLink";
import DashboardEntityListSection from "../../../common/section/dashboardEntityListSection";
import DashboardPageLayout from "../../../common/layout/dashboardPageLayout";
import { fetchAdminCategories } from "../../../services/sauces/category/categoryService";
import type { SauceCategory } from "../../../types/sauceCategory";
import { useCategoryRowActions } from "../../../hooks/useCategoryRowActions";
import { useAsyncStatus } from "../../../hooks/useAsyncStatus";
import { useDashboardEntityLoader } from "../../../hooks/useDashboardEntityLoader";

function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<SauceCategory[]>([]);
  const { errorMessage, setErrorMessage, startLoading, setSuccess, setError, isBusy, isSuccess, isError } = useAsyncStatus("idle");
  const { deleteErrorMessage, clearDeleteError, getCategoryRowActionProps } = useCategoryRowActions(setCategories);

  const loadCategories = useDashboardEntityLoader<SauceCategory>({
    fetchItems: fetchAdminCategories,
    setItems: setCategories,
    clearTransientError: clearDeleteError,
    setErrorMessage,
    startLoading,
    setSuccess,
    setError,
    errorFallbackMessage: "Impossible de charger les catégories.",
  });

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return (
    <DashboardPageLayout title="Catégories" description="Consultez les catégories existantes et mettez-les à jour." isBusy={isBusy}
      action={
        <DashboardCreateActionLink to="/dashboard/categories/create">
          Créer une catégorie
        </DashboardCreateActionLink>}>
      <AsyncStateView isLoading={isBusy} isError={isError} loadingLabel="Chargement des catégories..." errorMessage={errorMessage} onRetry={() => void loadCategories()}/>
      {deleteErrorMessage ? (
        <InlineErrorMessage className="mt-4">{deleteErrorMessage}</InlineErrorMessage>
      ) : null}
      {isSuccess ? (
        <DashboardEntityListSection items={categories} sectionTitle="Liste des catégories" emptyMessage="Aucune catégorie trouvée." sectionClassName="mt-8" emptyMessageClassName="text-body-sm mt-2 text-muted"
          renderItem={(category) => (
            <div key={category.id} className="flex items-center gap-4 rounded-xl border border-border/70 bg-surface px-4 py-3 text-sm text-foreground">
              <span className="flex-1">{category.name}</span>
              <EntityRowActions {...getCategoryRowActionProps(category)} />
            </div>
          )}
          listClassName="mt-3 space-y-2"
        />
      ) : null}
    </DashboardPageLayout>
  );
}

export default DashboardCategoriesPage;
