import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  children: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  headerAction?: ReactNode;
  headerSuffix?: ReactNode;
  containerClassName?: string;
  isBusy?: boolean;
  splitHeader?: boolean;
};

function PageShell({ title, children, eyebrow = "Administration", description, headerAction, headerSuffix, containerClassName, isBusy, splitHeader = false }: PageShellProps) {
  const rootClassName = `px-6 py-10 sm:py-14 ${containerClassName ?? ""}`.trim();

  const headingContent = (
    <div>
      <p className="text-caption font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h1 className="text-heading-1 mt-2 text-foreground">{title}</h1>
      {description ? <div className="text-body-sm mt-3 text-muted">{description}</div> : null}
    </div>
  );

  return (
    <div className={rootClassName} aria-busy={isBusy}>
      {splitHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-4">
          {headingContent}
          {headerAction}
        </div>
      ) : (
        headingContent
      )}
      {!splitHeader ? headerAction : null}
      {headerSuffix}
      {children}
    </div>
  );
}

export default PageShell;
