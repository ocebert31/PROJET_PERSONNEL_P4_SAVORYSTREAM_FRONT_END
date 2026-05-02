import type { ReactNode } from "react";
import { formatEuro } from "@/utils/formatEuro";

export type CheckoutTotalSectionProps = {
  amount: number;
  label?: string;
  detail?: ReactNode;
};

export default function CheckoutTotalSection({ amount, label = "Total", detail }: CheckoutTotalSectionProps) {
  return (
    <div className="mt-8 flex flex-col items-end gap-2 border-t border-border pt-6">
      <p className="text-body font-semibold text-foreground">
        {label} <span className="tabular-nums">{formatEuro(amount)}</span>
      </p>
      {detail ? <div className="text-caption max-w-md text-right text-muted">{detail}</div> : null}
    </div>
  );
}
