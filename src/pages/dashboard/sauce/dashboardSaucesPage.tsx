import { useCallback, useEffect, useState } from "react";
import AsyncStateView from "../../../common/feedback/asyncStateView";
import InlineErrorMessage from "../../../common/feedback/inlineErrorMessage";
import DashboardCreateActionLink from "../../../common/section/dashboardCreateActionLink";
import DashboardEntityListSection from "../../../common/section/dashboardEntityListSection";
import DashboardPageLayout from "../../../common/layout/dashboardPageLayout";
import EntityRowActions from "../../../common/button/entityRowActions";
import { fetchSauces } from "../../../services/sauces/sauceService";
import type { SauceApiSerialized } from "../../../types/sauce";
import { useSauceRowActions } from "../../../hooks/useSauceRowActions";
import { toErrorMessage } from "../../../utils/errorMessage";
import { useAsyncStatus } from "../../../hooks/useAsyncStatus";

function DashboardSaucesPage() {
  const [sauces, setSauces] = useState<SauceApiSerialized[]>([]);
  const { errorMessage, setErrorMessage, startLoading, setSuccess, setError, isBusy, isSuccess, isError } = useAsyncStatus("idle");
  const { deleteErrorMessage, clearDeleteError, getSauceRowActionProps } = useSauceRowActions(setSauces);

  const loadSauces = useCallback(async () => {
    startLoading(false);
    setErrorMessage("");
    clearDeleteError();
    try {
      const result = await fetchSauces();
      setSauces(result.sauces);
      setSuccess();
    } catch (error) {
      setSauces([]);
      setError(toErrorMessage(error, "Impossible de charger les sauces."));
    }
  }, [clearDeleteError, setError, setErrorMessage, setSuccess, startLoading]);

  useEffect(() => {
    void loadSauces();
  }, [loadSauces]);

  return (
    <DashboardPageLayout title="Sauces" description="Gérez les sauces existantes et accédez rapidement au formulaire d'édition." isBusy={isBusy}
      action={
        <DashboardCreateActionLink to="/dashboard/sauces/create">
          Créer une sauce
        </DashboardCreateActionLink>
      }>
      <AsyncStateView isLoading={isBusy} isError={isError} loadingLabel="Chargement des sauces..." errorMessage={errorMessage} onRetry={() => void loadSauces()}/>
      {deleteErrorMessage ? (
        <InlineErrorMessage className="mt-4">{deleteErrorMessage}</InlineErrorMessage>
      ) : null}
      {isSuccess ? (
        <DashboardEntityListSection items={sauces} emptyMessage="Aucune sauce trouvée." sectionClassName="mt-8" listClassName="space-y-3"
          renderItem={(sauce) => (
            <article key={sauce.id} className="flex items-center gap-4 rounded-xl border border-border/70 bg-surface p-3">
              <img src={sauce.image_url || "/assets/bbq.jpg"} alt={sauce.name} className="h-16 w-16 rounded-lg object-cover"/>
              <h2 className="text-label flex-1 font-semibold text-foreground">{sauce.name}</h2>
              <EntityRowActions {...getSauceRowActionProps(sauce)} />
            </article>
          )}
        />
      ) : null}
    </DashboardPageLayout>
  );
}

export default DashboardSaucesPage;
