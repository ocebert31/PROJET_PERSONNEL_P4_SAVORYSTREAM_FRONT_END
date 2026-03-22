import { Link } from "react-router-dom";

function SauceDetailNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-display text-2xl font-semibold text-foreground">Sauce introuvable</p>
      <p className="mt-2 text-muted">Cette sauce n’existe pas ou n’est plus au catalogue.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-hover">
        Retour à l’accueil
      </Link>
    </div>
  );
}

export default SauceDetailNotFound;
