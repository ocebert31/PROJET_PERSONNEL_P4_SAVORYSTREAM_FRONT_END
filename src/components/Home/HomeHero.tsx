import { Link } from "react-router-dom";

type HomeHeroProps = { backgroundImageUrl: string; featuredSauceId: string | undefined };

function HomeHero({ backgroundImageUrl, featuredSauceId }: HomeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImageUrl})` }} aria-hidden />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-foreground/25" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" aria-hidden />
      </div>
      <div className="relative mx-auto flex min-h-[min(72vh,560px)] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Artisanal · Sans compromis</p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
          L’art de la sauce, <span className="text-accent">bouteille après bouteille</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          Découvrez des recettes équilibrées, des ingrédients sélectionnés et des formats pensés pour vos envies du quotidien comme du grand soir.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href="#catalogue" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-foreground shadow-lg shadow-black/20 transition hover:bg-accent hover:text-foreground">
            Voir la sélection
          </a>
          <Link to={featuredSauceId != null ? `/sauce/${featuredSauceId}` : "/"} className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
            Coup de cœur du moment
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
