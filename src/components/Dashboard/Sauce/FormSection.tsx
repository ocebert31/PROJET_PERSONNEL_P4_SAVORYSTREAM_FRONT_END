import type { ReactNode } from "react";

export type FormSectionProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function FormSection({ title, description, children }: FormSectionProps) {
  const titleId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section className="rounded-2xl border border-border/80 bg-surface/50 p-5" aria-labelledby={titleId}>
      <h2 id={titleId} className="text-sm font-semibold text-foreground">{title}</h2>
      {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
      {children}
    </section>
  );
}
