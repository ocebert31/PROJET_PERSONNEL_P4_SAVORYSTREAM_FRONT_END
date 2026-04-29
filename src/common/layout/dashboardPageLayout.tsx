import type { ReactNode } from "react";

type DashboardPageLayoutProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  contentClassName?: string;
  isBusy?: boolean;
};

function DashboardPageLayout({ title, children, action, description, eyebrow = "Administration", contentClassName, isBusy }: DashboardPageLayoutProps) {
  return (
    <div className={`px-6 py-10 sm:py-14 ${contentClassName ?? ""}`.trim()} aria-busy={isBusy}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h1 className="text-heading-1 mt-2 text-foreground">{title}</h1>
          {description ? <div className="text-body-sm mt-3 text-muted">{description}</div> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export default DashboardPageLayout;
