import type { ReactNode } from "react";
import PageShell from "./pageShell";

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
    <PageShell
      title={title}
      eyebrow={eyebrow}
      description={description}
      containerClassName={contentClassName}
      headerAction={action}
      isBusy={isBusy}
      splitHeader={true}
    >
      {children}
    </PageShell>
  );
}

export default DashboardPageLayout;
