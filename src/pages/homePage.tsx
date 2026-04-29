import { useCallback, useEffect, useState } from "react";
import type { Sauce } from "../types/sauce";
import { sauceMapper } from "../mappers/sauce.mapper";
import { fetchSauces } from "../services/sauces/sauceService";
import HomeHero from "../components/Home/HomeHero";
import HomeCatalogue from "../components/Home/HomeCatalogue";
import HomeTrustStrip from "../components/Home/HomeTrustStrip";
import Button from "../common/button/button";
import { toErrorMessage } from "../utils/errorMessage";
import { useAsyncStatus } from "../hooks/useAsyncStatus";

function HomePage() {
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const { errorMessage, startLoading, setSuccess, setError, isBusy, isSuccess, isError } = useAsyncStatus("idle");

  const loadSauces = useCallback(async (isCancelled: () => boolean = () => false) => {
    startLoading();
    try {
      const { sauces: apiSauces } = await fetchSauces();
      if (isCancelled()) return;
      setSauces(apiSauces.map(sauceMapper));
      if (isCancelled()) return;
      setSuccess();
    } catch (e) {
      if (isCancelled()) return;
      setSauces([]);
      if (isCancelled()) return;
      setError(toErrorMessage(e, "Impossible de charger les sauces."));
    }
  }, [setError, setSuccess, startLoading]);

  useEffect(() => {
    let cancelled = false;
    void loadSauces(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [loadSauces]);

  const hero = sauces[0];
  const heroImage = hero?.image_url ?? "/assets/bbq.jpg";
  const featuredSauceId = hero?.id;

  return (
    <div className="pb-16">
      <HomeHero backgroundImageUrl={heroImage} featuredSauceId={featuredSauceId} />
      {isBusy && (
        <p className="mx-auto max-w-7xl px-6 pt-10 text-center text-sm text-muted" role="status">
          Chargement du catalogue…
        </p>
      )}
      {isError && (
        <div className="mx-auto max-w-7xl px-6 pt-10 text-center">
          <p className="text-body-sm text-destructive">{errorMessage}</p>
          <Button variant="secondary" onClick={() => void loadSauces()} className="mt-4">
            Réessayer
          </Button>
        </div>
      )}
      {isSuccess && <HomeCatalogue sauces={sauces} />}
      <HomeTrustStrip />
    </div>
  );
}

export default HomePage;
