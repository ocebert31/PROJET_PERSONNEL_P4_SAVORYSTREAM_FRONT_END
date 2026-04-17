import type { ProductVariantsProps } from "@/types/sauce";

const ProductVariants = ({ variants, selectedId, onSelect, isAvailable = true }: ProductVariantsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((v) => (
        <button key={v.id} type="button" onClick={() => onSelect(v.id)} disabled={!isAvailable}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            !isAvailable
              ? "cursor-not-allowed bg-border text-muted"
              : selectedId === v.id
                ? "bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/40 ring-offset-2 ring-offset-surface"
                : "bg-background text-foreground hover:bg-border/80"
          }`}
        >
          {v.volume}
          {v.stock !== undefined && (
            <span className="ml-1.5 text-xs font-normal opacity-80">(stock {v.stock})</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ProductVariants;
