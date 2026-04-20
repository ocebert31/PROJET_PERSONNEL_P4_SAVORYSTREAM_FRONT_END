import { Link } from "react-router-dom";
import type { Sauce } from "../../types/sauce";
import { formatPrimaryPriceLabel } from "../../utils/saucePricing";

function SauceProductCard({ sauce }: { sauce: Sauce }) {
  const priceLabel = formatPrimaryPriceLabel(sauce);
  const availabilityClassName = sauce.is_available ? "status-badge-success" : "status-badge-destructive";

  return (
    <article className="ds-card group flex flex-col overflow-hidden border border-border bg-surface transition hover:-translate-y-1 hover:ds-card-elevated">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={sauce.image_url} alt={sauce.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"/>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className={`ds-chip-radius absolute left-4 top-4 px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-md ${availabilityClassName}`}>
          {sauce.is_available ? "Disponible" : "En rupture"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-heading-3 text-foreground transition group-hover:text-primary">{sauce.name}</h3>
        <p className="text-body-sm mt-2 line-clamp-3 text-muted">{sauce.accroche}</p>
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-border/80 pt-5">
          <p className="text-heading-3 tabular-nums text-primary">{priceLabel}</p>
          <Link to={`/sauce/${sauce.id}`} aria-label={`Découvrir la sauce ${sauce.name}`} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            Découvrir<span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default SauceProductCard;
