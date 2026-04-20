import type { SauceBuySectionProps } from "@/types/sauce";
import AddToCartButton from "@/components/Sauce/Detail/Purchase/AddToCartButton";
import StepperButton from "@/common/button/StepperButton";

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
          <StepperButton onClick={decrement} aria-label="Diminuer la quantité">
            −
          </StepperButton>
          <span className="min-w-[3rem] px-2 py-2.5 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <StepperButton onClick={increment} aria-label="Augmenter la quantité">
            +
          </StepperButton>
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
