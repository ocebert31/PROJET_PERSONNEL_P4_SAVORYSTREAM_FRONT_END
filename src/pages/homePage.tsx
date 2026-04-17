import sauces from "../data/sauces.json";
import type { Sauce } from "../types/sauce";
import HomeHero from "../components/Home/HomeHero";
import HomeCatalogue from "../components/Home/HomeCatalogue";
import HomeTrustStrip from "../components/Home/HomeTrustStrip";

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
