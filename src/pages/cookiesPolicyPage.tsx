function CookiesPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-foreground">Politique cookies</h1>
      <p className="mt-3 text-sm text-muted">Dernière mise à jour : 31/03/2026</p>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Types de cookies</h2>
        <p className="text-sm text-muted">
          Le site peut utiliser des cookies strictement nécessaires au fonctionnement, des cookies de mesure d’audience
          et, selon votre consentement, des cookies marketing.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Consentement</h2>
        <p className="text-sm text-muted">
          Les cookies non essentiels ne sont déposés qu’après recueil de votre consentement via la bannière dédiée.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Refus et paramétrage</h2>
        <p className="text-sm text-muted">
          Vous pouvez accepter, refuser ou retirer votre consentement à tout moment via les paramètres cookies du site
          et/ou les réglages de votre navigateur.
        </p>
      </section>
    </div>
  );
}

export default CookiesPolicyPage;
