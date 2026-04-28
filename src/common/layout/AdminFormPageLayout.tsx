import type { ReactNode } from "react";

type AdminFormPageLayoutProps = {
  title: string;
  children: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  headerContent?: ReactNode;
};

function AdminFormPageLayout({ title, children, eyebrow = "Administration", description, headerContent }: AdminFormPageLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <p className="text-caption font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h1 className="text-heading-1 mt-2 text-foreground">{title}</h1>
      {description ? <div className="text-body-sm mt-3 text-muted">{description}</div> : null}
      {headerContent}
      {children}
    </div>
  );
}

export default AdminFormPageLayout;
