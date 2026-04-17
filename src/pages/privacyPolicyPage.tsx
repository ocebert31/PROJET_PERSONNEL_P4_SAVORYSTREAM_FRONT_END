function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-foreground">Politique de confidentialité</h1>
      <p className="mt-3 text-sm text-muted">Dernière mise à jour : 31/03/2026</p>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Responsable du traitement</h2>
        <p className="text-sm text-muted">
          Responsable du traitement : Bertrand Océane.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Données collectées</h2>
        <p className="text-sm text-muted">
          Nous pouvons collecter : nom, prénom, email, téléphone, adresse de livraison, données de commande et informations de paiement
          via des prestataires sécurisés.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Finalités de traitement</h2>
        <p className="text-sm text-muted">
          Les données sont utilisées pour : traitement des commandes, livraison, facturation, support client, amélioration du service
          et envoi d’informations marketing si vous y avez consenti.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Bases légales (RGPD)</h2>
        <p className="text-sm text-muted">
          Les traitements reposent sur : l’exécution du contrat (gestion des commandes et livraisons), le consentement (newsletter et
          communications marketing), et les obligations légales (facturation, obligations comptables et fiscales).
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Durée de conservation</h2>
        <p className="text-sm text-muted">
          Les données sont conservées pendant la durée nécessaire aux finalités poursuivies, puis archivées ou supprimées conformément
          aux obligations légales en vigueur.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Partage des données</h2>
        <p className="text-sm text-muted">
          Les données peuvent être partagées uniquement avec des prestataires agissant pour notre compte (paiement, livraison, hébergement),
          dans le strict cadre de leurs missions.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Droits des utilisateurs</h2>
        <p className="text-sm text-muted">
          Vous disposez des droits d’accès, de rectification, de suppression, d’opposition et de portabilité de vos données. Pour exercer
          ces droits, contactez-nous à : contact.savorystream@gmail.com.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
        <p className="text-sm text-muted">
          Des cookies peuvent être utilisés pour améliorer l’expérience utilisateur et mesurer l’audience. Pour plus d’informations,
          consultez notre politique cookies.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Sécurité</h2>
        <p className="text-sm text-muted">
          Nous mettons en oeuvre des mesures techniques et organisationnelles adaptées pour protéger vos données (HTTPS, contrôle d’accès,
          bonnes pratiques de sécurité).
        </p>
      </section>
    </div>
  );
}

export default PrivacyPolicyPage;
