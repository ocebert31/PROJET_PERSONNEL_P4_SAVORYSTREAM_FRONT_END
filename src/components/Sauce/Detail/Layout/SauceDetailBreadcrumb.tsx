import { Link } from "react-router-dom";

function SauceDetailBreadcrumb({ productName }: { productName: string }) {
  return (
    <nav className="mb-8 text-sm text-muted" aria-label="Fil d’Ariane">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="transition hover:text-primary">Accueil</Link>
        </li>
        <li aria-hidden className="text-border">/</li>
        <li className="font-medium text-foreground">{productName}</li>
      </ol>
    </nav>
  );
}

export default SauceDetailBreadcrumb;
