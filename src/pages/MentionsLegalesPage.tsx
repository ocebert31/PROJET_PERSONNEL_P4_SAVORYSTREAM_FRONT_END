function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-foreground">Mentions légales</h1>
      <p className="mt-3 text-sm text-muted">Dernière mise à jour : 31/03/2026</p>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Éditeur du site</h2>
        <p className="text-sm text-muted">Nom / Prénom : Bertrand Océane</p>
        <p className="text-sm text-muted">Statut : Projet personnel</p>
        <p className="text-sm text-muted">Siège social : Bordeaux</p>
        <p className="text-sm text-muted">Email : contact.savorystream@gmail.com</p>
        <p className="text-sm text-muted">Téléphone : 0673390957</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Informations entreprise</h2>
        <p className="text-sm text-muted">SIRET : 552 178 639 00890</p>
        <p className="text-sm text-muted">RCS + ville : RCS Bordeaux B 552 178 639</p>
        <p className="text-sm text-muted">TVA intracommunautaire : FR 12 552 178 639 00890</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Responsable de publication</h2>
        <p className="text-sm text-muted">Directeur de la publication : Bertrand Océane</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Hébergement frontend</h2>
        <p className="text-sm text-muted">Hébergeur : Netlify</p>
        <p className="text-sm text-muted">Adresse : 512 2nd Street, Suite 200 San Francisco, CA 94107 USA</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Hébergement backend</h2>
        <p className="text-sm text-muted">Hébergeur : Always Data</p>
        <p className="text-sm text-muted">Adresse : 91 Rue du Faubourg Saint-Honoré, 75008 Paris</p>
        <p className="text-sm text-muted">Téléphone : 01 84 16 23 40</p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Propriété intellectuelle</h2>
        <p className="text-sm text-muted">
          Tous les contenus présents sur le site (textes, images, logos, éléments graphiques) sont protégés par les lois
          en vigueur. Toute reproduction, représentation, modification ou exploitation sans autorisation écrite préalable est interdite.
        </p>
      </section>

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Limitation de responsabilité</h2>
        <p className="text-sm text-muted">
          L’éditeur s’efforce d’assurer l’exactitude des informations publiées. Il ne peut toutefois garantir l’absence d’erreurs
          ou d’omissions et ne saurait être tenu responsable d’un dommage direct ou indirect lié à l’utilisation du site.
        </p>
      </section>
    </div>
  );
}

export default MentionsLegalesPage;
