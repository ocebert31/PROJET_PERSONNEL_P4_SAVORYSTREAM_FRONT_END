import AddToCartButton from "./AddToCartButton";
import { SauceBuySectionProps } from "../../../types/Sauce";

export default function SauceBuySection({ sauce, selected, quantity, setQuantity }: SauceBuySectionProps) {
    const increment = () => setQuantity((q) => Math.min(selected.stock ?? 100, q + 1));
    const decrement = () => setQuantity((q) => Math.max(1, q - 1));
    const total = (selected.prix * quantity).toFixed(2);

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <p className="text-lg text-gray-800 font-medium">
                    Prix unitaire : <span className="text-primary font-bold">{selected.prix.toFixed(2)} €</span>
                </p>
                <div className="flex items-center border rounded-full overflow-hidden">
                    <button onClick={decrement} className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors">
                        -
                    </button>
                    <span className="px-6 py-2">{quantity}</span>
                    <button onClick={increment} className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors">
                        +
                    </button>
                </div>
            </div>
            <p className="text-2xl font-bold text-primary mb-4 transition-transform duration-200 transform scale-105">
                Total : {total} €
            </p>
            <AddToCartButton sauce={sauce} selected={selected} quantity={quantity} />
        </div>
    );
}
