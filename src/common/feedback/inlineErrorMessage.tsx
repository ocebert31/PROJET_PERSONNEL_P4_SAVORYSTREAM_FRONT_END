import type { ReactNode } from "react";

type InlineErrorMessageProps = {
  children: ReactNode;
  className?: string;
};

function InlineErrorMessage({ children, className }: InlineErrorMessageProps) {
  return <p className={`text-body-sm text-destructive ${className ?? ""}`.trim()}>{children}</p>;
}

export default InlineErrorMessage;
