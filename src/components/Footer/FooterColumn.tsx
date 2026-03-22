import type { ReactNode } from "react";

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default FooterColumn;
