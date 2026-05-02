import { Link } from "react-router-dom";
import Button from "@/common/button/button";
import QuantityStepper from "@/common/fields/quantityStepper";
import type { CartLineItem } from "@/types/cart";
import { formatEuro } from "@/utils/formatEuro";

export type CartLineRowProps = {
  line: CartLineItem;
  busy: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

export default function CartLineRow({ line, busy, onIncrement, onDecrement, onRemove }: CartLineRowProps) {
  const lineLabel = `${line.sauce_name} (${line.volume})`;
  return (
    <li className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <Link to={`/sauce/${line.sauce_id}`} className="flex min-w-0 flex-1 items-start gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:items-center">
        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {line.sauce_image_url ? (
            <img src={line.sauce_image_url} alt="" className="h-full w-full object-cover" decoding="async" />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-body font-medium text-primary hover:text-primary-hover">{line.sauce_name}</span>
          <p className="text-caption mt-1 text-muted">
            {line.volume} · {formatEuro(line.unit_price)} × {line.quantity} ·{" "}
            <span className="font-medium text-foreground">{formatEuro(line.line_total)}</span>
          </p>
        </span>
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <QuantityStepper
          quantity={line.quantity}
          disabled={busy}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          decreaseAriaLabel={`Diminuer la quantité de ${lineLabel}`}
          increaseAriaLabel={`Augmenter la quantité de ${lineLabel}`}
          groupAriaLabel={`Quantité pour ${lineLabel}`}
          quantityAriaLive="polite"
        />
        <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={onRemove}>
          Retirer
        </Button>
      </div>
    </li>
  );
}
