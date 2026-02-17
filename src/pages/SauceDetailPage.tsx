import { useParams } from "react-router-dom";
import ProductVariants from "../components/Sauce/Detail/ProductVariants";
import SauceTabs from "../components/Sauce/Detail/SauceTabs";
import SauceBuySection from "../components/Sauce/Detail/SauceBuySection";
import { useSauceDetail } from "../hooks/useSauceDetail";

function SauceDetail() {
  const { id } = useParams<{ id: string }>();
  const { sauce, selected, selectedCond, setSelectedCond, quantity, setQuantity } = useSauceDetail(id);

  if (!sauce) {
    return (
      <p className="text-center mt-20 text-xl text-gray-500">
        Sauce non trouvée 😢
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col lg:flex-row gap-12 items-center bg-white overflow-hidden rounded-3xl">
        <div className="lg:w-1/2 relative h-[420px] overflow-hidden">
          <img src={sauce.image_url} alt={sauce.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center p-8">
          <h1 className="text-5xl text-gray-900 mb-4">{sauce.name}</h1>
          <p className="text-gray-600 mb-8">{sauce.description}</p>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Choisis ton format :
          </h3>
          {!sauce.is_available && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg font-medium">
              Cette sauce n'est pas disponible pour le moment 😢
            </div>
          )}
          <ProductVariants variants={sauce.conditionnements} selectedId={selectedCond} onSelect={(id) => {setSelectedCond(id); setQuantity(1)}} isAvailable={sauce.is_available}/>
          {selected && (
            <SauceBuySection sauce={sauce} selected={selected} quantity={quantity} setQuantity={setQuantity}/>
          )}
        </div>
      </div>
      <SauceTabs caracteristique={sauce.caracteristique} ingredients={sauce.ingredients}/>
    </div>
  );
}

export default SauceDetail;
