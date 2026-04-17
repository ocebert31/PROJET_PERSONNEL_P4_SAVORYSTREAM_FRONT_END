function HomeTrustStrip() {
  const items = [
    { title: "Paiement sécurisé", body: "Transactions protégées et données confidentielles." },
    { title: "Envoi rapide", body: "Préparation soignée et expédition suivie." },
    { title: "Une question ?", body: "Notre équipe vous répond avec le sourire." },
  ];
  return (
    <section className="mx-auto mt-20 max-w-7xl px-6">
      <div className="rounded-3xl border border-border bg-surface px-6 py-10 shadow-inner shadow-stone-900/5 sm:px-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {items.map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <p className="font-display text-lg font-semibold text-foreground">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeTrustStrip;
