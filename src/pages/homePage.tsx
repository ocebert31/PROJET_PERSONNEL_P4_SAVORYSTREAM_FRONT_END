import { useCallback, useEffect, useState } from "react";
import type { Sauce } from "../types/sauce";
import { sauceMapper } from "../mappers/sauce.mapper";
import { fetchSauces } from "../services/sauces/sauceService";
import { ApiError } from "../services/apiRequest/apiError";
import HomeHero from "../components/Home/HomeHero";
import HomeCatalogue from "../components/Home/HomeCatalogue";
import HomeTrustStrip from "../components/Home/HomeTrustStrip";
import Button from "../common/button/Button";

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
          <p className="text-body-sm text-destructive">{errorMessage}</p>
          <Button variant="secondary" onClick={() => void loadSauces()} className="mt-4">
            Réessayer
          </Button>
        </div>
      )}
      {showCatalogue && <HomeCatalogue sauces={sauces} />}
      <HomeTrustStrip />
    </div>
  );
}

export default HomePage;
