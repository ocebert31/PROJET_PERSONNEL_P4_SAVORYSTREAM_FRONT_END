import type { ReactNode } from "react";

function AuthCard({ eyebrow, title, subtitle, children, footer }: { eyebrow: string; title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-surface/95 p-8 shadow-2xl shadow-stone-900/10 backdrop-blur-sm sm:p-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
      <h1 className="font-display mt-2 text-center text-3xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-center text-sm text-muted">{subtitle}</p>
      {children}
      {footer}
    </div>
  );
}

export default AuthCard;
