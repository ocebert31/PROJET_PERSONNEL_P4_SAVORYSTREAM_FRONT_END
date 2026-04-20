import type { ProductVariantsProps } from "@/types/sauce";
import ChipButton from "@/common/button/ChipButton";

const ProductVariants = ({ variants, selectedId, onSelect, isAvailable = true }: ProductVariantsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((v) => (
        <ChipButton key={v.id} onClick={() => onSelect(v.id)} disabled={!isAvailable} selected={selectedId === v.id}>
          {v.volume}
          {v.stock !== undefined && (
            <span className="ml-1.5 text-xs font-normal opacity-80">(stock {v.stock})</span>
          )}
        </ChipButton>
      ))}
    </div>
  );
};

export default ProductVariants;
