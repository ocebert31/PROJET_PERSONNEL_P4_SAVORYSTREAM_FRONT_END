import type { SauceDetailPurchasePanelProps } from "@/types/Sauce";
import ProductVariants from "@/components/Sauce/Detail/Purchase/ProductVariants";
import SauceBuySection from "@/components/Sauce/Detail/Purchase/SauceBuySection";

function SauceDetailPurchasePanel({ sauce, selected, selectedCond, quantity, setSelectedCond, setQuantity }: SauceDetailPurchasePanelProps) {
  return (
    <div className="flex flex-1 flex-col justify-center p-8 sm:p-10 lg:p-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{sauce.name}</h1>
      <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{sauce.description}</p>
      <h2 className="mt-10 font-display text-lg font-semibold text-foreground">Choisis ton format</h2>
      {!sauce.is_available && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">Cette sauce n’est pas disponible pour le moment.</div>
      )}
      <div className="mt-4">
        <ProductVariants variants={sauce.conditionnements} selectedId={selectedCond} onSelect={(id) => { setSelectedCond(id); setQuantity(1); }} isAvailable={sauce.is_available} />
      </div>
      {selected && (
        <div className="mt-6 border-t border-border pt-8">
          <SauceBuySection sauce={sauce} selected={selected} quantity={quantity} setQuantity={setQuantity} />
        </div>
      )}
    </div>
  );
}

export default SauceDetailPurchasePanel;
