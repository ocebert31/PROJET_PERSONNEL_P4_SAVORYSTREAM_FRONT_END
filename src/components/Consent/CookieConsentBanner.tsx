import { Link } from "react-router-dom";
import { useConsent } from "../../context/consentContext";
import Button from "../../common/button/button";

function CookieConsentBanner() {
  const { status, accept, reject } = useConsent();

  if (status !== null) return null;

  return (
    <aside className="fixed inset-x-4 bottom-4 z-[250] rounded-2xl border border-border bg-surface p-4 shadow-lg sm:inset-x-8" role="dialog"aria-label="Préférences cookies">
      <p className="text-sm text-foreground">
        Nous utilisons des cookies pour le fonctionnement du site et, avec votre accord, pour la mesure d’audience et les contenus marketing.
      </p>
      <p className="mt-2 text-xs text-muted">
        Consultez notre{" "}
        <Link to="/cookies" className="underline underline-offset-2">
          politique cookies
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" variant="primary" size="sm" onClick={accept}>
          Tout accepter
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={reject}>
          Tout refuser
        </Button>
      </div>
    </aside>
  );
}

export default CookieConsentBanner;
