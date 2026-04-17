function TermsOfSalePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-foreground">Conditions Générales de Vente (CGV)</h1>
      <p className="mt-3 text-sm text-muted">Dernière mise à jour : 31/03/2026</p>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Produits</h2>
        <p className="text-sm text-muted">
          La disponibilité des produits est indiquée en temps réel sur le site (mentions "Disponible" / "En rupture"), au moment de la consultation et de la commande.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Prix</h2>
        <p className="text-sm text-muted">
          Les prix sont indiqués en euros TTC. Les frais de livraison applicables sont ajoutés et affichés avant validation définitive
          de la commande.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Paiement</h2>
        <p className="text-sm text-muted">
          Les paiements sont effectués via des prestataires de paiement sécurisés (Stripe). La commande est
          considérée comme validée après confirmation de paiement. En cas d’échec, de refus ou d’incident de paiement, la commande peut être suspendue ou annulée.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Livraison</h2>
        <p className="text-sm text-muted">
          Les zones, modalités et délais de livraison sont précisés avant validation de la commande. Les délais sont donnés à titre indicatif.
          Le transfert des risques s’opère à la réception de la commande par le client.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Droit de rétractation</h2>
        <p className="text-sm text-muted">
          Conformément à la réglementation européenne, le client dispose d’un délai de 14 jours pour exercer son droit de rétractation,
          sous réserve des exceptions légales applicables. Le client doit retourner les produits selon les modalités communiquées, et le
          remboursement est effectué dans un délai maximal de 14 jours après réception et vérification du retour.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Exceptions et remboursements</h2>
        <p className="text-sm text-muted">
          Certains produits peuvent être exclus du droit de rétractation selon la loi (ex. denrées périssables). Les modalités de retour
          et de remboursement sont communiquées au client lors de la demande. Les produits alimentaires ouverts, descellés ou altérés
          après livraison ne peuvent pas être retournés, sauf disposition légale contraire.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Litiges</h2>
        <p className="text-sm text-muted">
          Les présentes CGV sont soumises au droit français. En cas de litige, le client peut recourir à un médiateur de la consommation
          avant toute action judiciaire. Coordonnées du médiateur : contact.savorystream@gmail.com. Le client peut également utiliser la plateforme européenne
          de règlement en ligne des litiges (ODR) lorsque applicable.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Compte client</h2>
        <p className="text-sm text-muted">
          Le client est responsable de l’exactitude des informations fournies et de la confidentialité de ses identifiants de connexion.
          Toute action réalisée depuis le compte client est présumée effectuée par son titulaire, sauf preuve contraire.
        </p>
      </section>
    </div>
  );
}

export default TermsOfSalePage;
