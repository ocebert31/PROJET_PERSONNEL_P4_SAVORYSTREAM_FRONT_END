import FooterColumn from "./FooterColumn";
import FooterLegalLinks from "./FooterLegalLinks";

function Footer() {
  const reassurance = ["Paiement sécurisé", "Expédition soignée", "Service client réactif"];
  return (
    <footer className="mt-auto border-t border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-semibold text-primary">SavoryStream</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">Des sauces préparées avec soin, pour sublimer vos plats du quotidien.</p>
          </div>
          <FooterColumn title="Boutique">
            <ul className="space-y-2 text-sm text-muted">
              <li>Nos sauces</li>
              <li>Nouveautés</li>
              <li>Promotions</li>
            </ul>
          </FooterColumn>
          <FooterColumn title="Aide">
            <ul className="space-y-2 text-sm text-muted">
              <li>Livraison & retours</li>
              <li>Contact</li>
              <li>FAQ</li>
            </ul>
          </FooterColumn>
          <FooterColumn title="Réassurance">
            <ul className="mt-0 space-y-3 text-sm text-muted">
              {reassurance.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary" aria-hidden>✓</span>
                  {line}
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center text-xs text-muted sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} SavoryStream. Tous droits réservés.</p>
          <FooterLegalLinks />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
