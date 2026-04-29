import type { ReactNode } from "react";
import PageShell from "./pageShell";

type AdminFormPageLayoutProps = {
  title: string;
  children: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  headerContent?: ReactNode;
  contentClassName?: string;
};

function AdminFormPageLayout({
  title,
  children,
  eyebrow = "Administration",
  description,
  headerContent,
  contentClassName: formContentClassName,
}: AdminFormPageLayoutProps) {
  return (
    <PageShell
      title={title}
      eyebrow={eyebrow}
      description={description}
      containerClassName={formContentClassName ?? "mx-auto max-w-7xl"}
      headerSuffix={headerContent}
    >
      {children}
    </PageShell>
  );
}

export default AdminFormPageLayout;
