import type { Sauce } from "../../types/sauce";
import SauceProductCard from "./SauceProductCard";

function HomeCatalogue({ sauces }: { sauces: Sauce[] }) {
  return (
    <section id="catalogue" className="mx-auto max-w-7xl scroll-mt-24 px-6 pt-16 sm:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Nos Sauces Maison 🍶</h2>
        <p className="mt-3 text-muted">Une sélection gourmande pour tous les goûts — des classiques fumés aux créations épicées.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {sauces.map((sauce) => (
          <SauceProductCard key={sauce.id} sauce={sauce} />
        ))}
      </div>
    </section>
  );
}

export default HomeCatalogue;
