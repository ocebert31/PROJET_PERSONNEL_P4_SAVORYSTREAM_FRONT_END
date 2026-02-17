import { ProductVariantsProps } from "../../../types/Sauce";

const ProductVariants = ({ variants, selectedId, onSelect, isAvailable = true }: ProductVariantsProps) => {
    return (
        <div className="flex flex-wrap gap-4 mb-6">
            {variants.map((v) => (
                <button key={v.id} onClick={() => onSelect(v.id)} disabled={!isAvailable} className={`px-6 py-3 rounded-full font-medium transition-all duration-200 transform ${
                    !isAvailable ? "bg-gray-300 text-gray-400 cursor-not-allowed" 
                    : selectedId === v.id ? "bg-primary text-white ring-2 ring-purple-500 scale-105" : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"}`}>
                {v.volume} {v.stock !== undefined && `(Stock: ${v.stock})`}
                </button>
            ))}
        </div>
    );
};

export default ProductVariants;
