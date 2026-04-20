import { useCallback, useEffect, useState } from "react";
import type { Sauce } from "../types/sauce";
import { sauceMapper } from "../mappers/sauce.mapper";
import { fetchSauces } from "../services/sauces/sauceService";
import { ApiError } from "../services/apiRequest/apiError";
import HomeHero from "../components/Home/HomeHero";
import HomeCatalogue from "../components/Home/HomeCatalogue";
import HomeTrustStrip from "../components/Home/HomeTrustStrip";

type LoadStatus = "idle" | "loading" | "error" | "success";

function errorMessageFromUnknown(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error) return e.message;
  return "Impossible de charger les sauces.";
}

function HomePage() {
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const loadSauces = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(undefined);
    try {
      const { sauces: apiSauces } = await fetchSauces();
      setSauces(apiSauces.map(sauceMapper));
      setStatus("success");
    } catch (e) {
      setSauces([]);
      setErrorMessage(errorMessageFromUnknown(e));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadSauces();
  }, [loadSauces]);

  const hero = sauces[0];
  const heroImage = hero?.image_url ?? "/assets/bbq.jpg";
  const featuredSauceId = hero?.id;

  const showCatalogue = status === "success";
  const showLoading = status === "idle" || status === "loading";
  const showError = status === "error";

  return (
    <div className="pb-16">
      <HomeHero backgroundImageUrl={heroImage} featuredSauceId={featuredSauceId} />
      {showLoading && (
        <p className="mx-auto max-w-7xl px-6 pt-10 text-center text-sm text-muted" role="status">
          Chargement du catalogue…
        </p>
      )}
      {showError && (
        <div className="mx-auto max-w-7xl px-6 pt-10 text-center">
          <p className="text-sm text-destructive">{errorMessage}</p>
          <button
            type="button"
            onClick={() => void loadSauces()}
            className="mt-4 inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Réessayer
          </button>
        </div>
      )}
      {showCatalogue && <HomeCatalogue sauces={sauces} />}
      <HomeTrustStrip />
    </div>
  );
}

export default HomePage;
