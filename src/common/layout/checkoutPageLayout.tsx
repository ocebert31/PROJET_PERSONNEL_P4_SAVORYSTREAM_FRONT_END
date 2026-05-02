import type { ReactNode } from "react";

export const CHECKOUT_PAGE_SHELL_CLASS = "mx-auto max-w-3xl px-6 py-10";

export type CheckoutPageLayoutProps = {
  title: string;
  subtitle?: ReactNode;
  headerActions?: ReactNode;
  compactHeader?: boolean;
  children: ReactNode;
};

export default function CheckoutPageLayout({ title, subtitle, headerActions, compactHeader = false, children }: CheckoutPageLayoutProps) {
  return (
    <div className={CHECKOUT_PAGE_SHELL_CLASS}>
      {compactHeader ? (
        <>
          <h1 className="text-heading-2 font-semibold text-foreground">{title}</h1>
          {children}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-heading-2 font-semibold text-foreground">{title}</h1>
              {subtitle != null && subtitle !== "" ? (
                <div className="text-body-sm mt-1 text-muted">{subtitle}</div>
              ) : null}
            </div>
            {headerActions ? <div className="flex flex-wrap gap-3">{headerActions}</div> : null}
          </div>
          {children}
        </>
      )}
    </div>
  );
}
