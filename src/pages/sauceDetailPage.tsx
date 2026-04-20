import { useParams } from "react-router-dom";
import SauceDetailBreadcrumb from "../components/Sauce/Detail/Layout/SauceDetailBreadcrumb";
import SauceDetailMedia from "../components/Sauce/Detail/Layout/SauceDetailMedia";
import SauceDetailNotFound from "../components/Sauce/Detail/Layout/SauceDetailNotFound";
import SauceDetailPurchasePanel from "../components/Sauce/Detail/Purchase/SauceDetailPurchasePanel";
import SauceTabs from "../components/Sauce/Detail/Tabs/SauceTabs";
import { useSauceDetail } from "../hooks/useSauceDetail";

function SauceDetail() {
  const { id } = useParams<{ id: string }>();
  const { sauce, selected, selectedCond, setSelectedCond, quantity, setQuantity, isLoading, error, retry } =
    useSauceDetail(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-sm text-muted" role="status">
          Chargement de la sauce…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <button type="button" onClick={retry} className="mt-4 inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          Réessayer
        </button>
      </div>
    );
  }

  if (!sauce) return <SauceDetailNotFound />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14 lg:py-16">
      <SauceDetailBreadcrumb productName={sauce.name} />
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-stone-900/10">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <SauceDetailMedia imageUrl={sauce.image_url} name={sauce.name} />
          <SauceDetailPurchasePanel sauce={sauce} selected={selected} selectedCond={selectedCond} quantity={quantity} setSelectedCond={setSelectedCond} setQuantity={setQuantity} />
        </div>
      </div>
      <SauceTabs caracteristique={sauce.caracteristique} ingredients={sauce.ingredients} />
    </div>
  );
}

export default SauceDetail;
