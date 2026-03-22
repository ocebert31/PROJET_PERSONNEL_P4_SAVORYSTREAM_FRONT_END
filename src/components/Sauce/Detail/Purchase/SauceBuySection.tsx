import type { SauceBuySectionProps } from "@/types/Sauce";
import AddToCartButton from "@/components/Sauce/Detail/Purchase/AddToCartButton";

export default function SauceBuySection({ sauce, selected, quantity, setQuantity }: SauceBuySectionProps) {
  const increment = () => setQuantity((q) => Math.min(selected.stock ?? 100, q + 1));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const total = (selected.prix * quantity).toFixed(2);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Prix unitaire{" "}
          <span className="font-display text-lg font-semibold tabular-nums text-primary">
            {selected.prix.toFixed(2)} €
          </span>
        </p>
        <div className="inline-flex items-center overflow-hidden rounded-full border border-border bg-background">
          <button type="button" onClick={decrement} className="px-4 py-2.5 text-lg font-medium text-foreground transition hover:bg-primary hover:text-white" aria-label="Diminuer la quantité">
            −
          </button>
          <span className="min-w-[3rem] px-2 py-2.5 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <button type="button" onClick={increment} className="px-4 py-2.5 text-lg font-medium text-foreground transition hover:bg-primary hover:text-white" aria-label="Augmenter la quantité">
            +
          </button>
        </div>
      </div>
      <p className="font-display mt-6 text-2xl font-semibold tabular-nums text-foreground">
        Total : {total} €
      </p>
      <div className="mt-6">
        <AddToCartButton sauce={sauce} selected={selected} quantity={quantity} />
      </div>
    </div>
  );
}
