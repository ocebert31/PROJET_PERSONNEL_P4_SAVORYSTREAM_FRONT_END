import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../../common/button/button";
import EntityRowActions from "../../../common/button/EntityRowActions";
import { ApiError } from "../../../services/apiRequest/apiError";
import { fetchSauces } from "../../../services/sauces/sauceService";
import type { SauceApiSerialized } from "../../../types/sauce";
import { useDeleteSauce } from "../../../hooks/useDeleteSauce";

type LoadStatus = "idle" | "loading" | "success" | "error";

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Impossible de charger les sauces.";
}

function DashboardSaucesPage() {
  const [sauces, setSauces] = useState<SauceApiSerialized[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { deleteSauceById, deletingSauceId, deleteErrorMessage, clearDeleteError } = useDeleteSauce();

  const loadSauces = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    clearDeleteError();
    try {
      const result = await fetchSauces();
      setSauces(result.sauces);
      setStatus("success");
    } catch (error) {
      setSauces([]);
      setErrorMessage(toErrorMessage(error));
      setStatus("error");
    }
  }, [clearDeleteError]);

  useEffect(() => {
    void loadSauces();
  }, [loadSauces]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14" aria-busy={status === "loading" || status === "idle"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wider text-primary">Administration</p>
          <h1 className="text-heading-1 mt-2 text-foreground">Sauces</h1>
          <p className="text-body-sm mt-3 text-muted">Gérez les sauces existantes et accédez rapidement au formulaire d'édition.</p>
        </div>
        <NavLink to="/dashboard/sauces/create" className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          Créer une sauce
        </NavLink>
      </div>
      {status === "loading" || status === "idle" ? (
        <p role="status" className="text-body-sm mt-6 text-muted">
          Chargement des sauces...
        </p>
      ) : null}
      {status === "error" ? (
        <div className="mt-6">
          <p className="text-body-sm text-destructive">{errorMessage}</p>
          <Button variant="secondary" className="mt-3" onClick={() => void loadSauces()}>
            Réessayer
          </Button>
        </div>
      ) : null}
      {deleteErrorMessage ? (
        <p className="text-body-sm mt-4 text-destructive">{deleteErrorMessage}</p>
      ) : null}
      {status === "success" ? (
        <div className="mt-8 space-y-3">
          {sauces.length === 0 ? (
            <p className="text-body-sm text-muted">Aucune sauce trouvée.</p>
          ) : (
            sauces.map((sauce) => (
              <article key={sauce.id} className="flex items-center gap-4 rounded-xl border border-border/70 bg-surface p-3">
                <img src={sauce.image_url || "/assets/bbq.jpg"} alt={sauce.name} className="h-16 w-16 rounded-lg object-cover"/>
                <h2 className="text-label flex-1 font-semibold text-foreground">{sauce.name}</h2>
                <EntityRowActions editTo={`/dashboard/sauces/${sauce.id}/edit`} editLabel={`Editer la sauce ${sauce.name}`}
                  deleteItemName={`la sauce ${sauce.name}`} deleteId={sauce.id}
                  onDeleteById={deleteSauceById}
                  onDeleteSuccess={(deletedId) =>
                    setSauces((currentSauces) => currentSauces.filter((item) => item.id !== deletedId))
                  }
                  onOpenDeleteConfirm={clearDeleteError} isDeleting={deletingSauceId === sauce.id}/>
              </article>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export default DashboardSaucesPage;
