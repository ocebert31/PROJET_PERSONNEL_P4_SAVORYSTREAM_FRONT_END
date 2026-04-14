import type { ReactNode } from "react";

export type FormSectionProps = {
  title: string;
  children?: ReactNode;
};

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-surface/50 p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}
