import type { ReactNode } from "react";

function AuthCard({ eyebrow, title, subtitle, children, footer }: { eyebrow: string; title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="ds-card ds-card-elevated border border-border bg-surface/95 p-8 backdrop-blur-sm sm:p-10">
      <p className="text-caption text-center font-semibold uppercase tracking-[0.2em]">{eyebrow}</p>
      <h1 className="text-heading-1 mt-2 text-center text-foreground">{title}</h1>
      <p className="text-body-sm mt-2 text-center text-muted">{subtitle}</p>
      {children}
      {footer}
    </div>
  );
}

export default AuthCard;
