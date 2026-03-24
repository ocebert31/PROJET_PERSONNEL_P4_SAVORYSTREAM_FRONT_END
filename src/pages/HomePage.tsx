import sauces from "../data/sauces.json";
import type { Sauce } from "../types/Sauce";
import HomeHero from "../components/home/HomeHero";
import HomeCatalogue from "../components/home/HomeCatalogue";
import HomeTrustStrip from "../components/home/HomeTrustStrip";

const catalog = sauces as Sauce[];

function HomePage() {
  const hero = catalog[0];
  const heroImage = hero?.image_url ?? "/assets/bbq.jpg";
  return (
    <div className="pb-16">
      <HomeHero backgroundImageUrl={heroImage} featuredSauceId={hero?.id} />
      <HomeCatalogue sauces={catalog} />
      <HomeTrustStrip />
    </div>
  );
}

export default HomePage;
