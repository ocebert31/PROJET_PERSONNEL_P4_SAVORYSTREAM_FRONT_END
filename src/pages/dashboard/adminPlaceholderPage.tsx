type AdminPlaceholderPageProps = {
  sectionName: string;
};

function AdminPlaceholderPage({ sectionName }: AdminPlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <p className="text-caption font-semibold uppercase tracking-wider text-primary">Administration</p>
      <h1 className="text-heading-1 mt-2 text-foreground">{sectionName}</h1>
      <p className="text-body-sm mt-3 text-muted">
        Cette section sera bientôt disponible. Pour le moment, la gestion implémentée concerne la création et la modification des sauces.
      </p>
    </div>
  );
}

export default AdminPlaceholderPage;
