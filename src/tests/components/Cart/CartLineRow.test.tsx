import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CartLineRow from "../../../components/Cart/CartLineRow";
import type { CartLineItem } from "../../../types/cart";

function minimalLine(overrides: Partial<CartLineItem> = {}): CartLineItem {
  return {
    id: "line-a",
    sauce_id: "sauce-a",
    sauce_name: "Sauce A",
    sauce_image_url: null,
    conditioning_id: "cond-a",
    volume: "250ml",
    quantity: 2,
    unit_price: 10,
    line_total: 20,
    ...overrides,
  };
}

function renderCartLineRow(props: {
  line?: CartLineItem;
  busy?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
}) {
  const {
    line = minimalLine(),
    busy = false,
    onIncrement = vi.fn(),
    onDecrement = vi.fn(),
    onRemove = vi.fn(),
  } = props;
  return render(
    <MemoryRouter>
      <ul>
        <CartLineRow
          line={line}
          busy={busy}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onRemove={onRemove}
        />
      </ul>
    </MemoryRouter>,
  );
}

describe("CartLineRow", () => {
  describe("nominal case", () => {
    it("shows sauce info, formatted prices and links to the sauce detail page", () => {
      renderCartLineRow({});

      const link = screen.getByRole("link", { name: /Sauce A/i });
      expect(link).toHaveAttribute("href", "/sauce/sauce-a");
      expect(screen.getByText(/250ml/)).toBeInTheDocument();
      expect(screen.getByText(/10\.00 €/)).toBeInTheDocument();
      expect(screen.getByText(/20\.00 €/)).toBeInTheDocument();
    });

    it("calls callbacks when quantity buttons or remove are used", async () => {
      const onIncrement = vi.fn();
      const onDecrement = vi.fn();
      const onRemove = vi.fn();
      const user = userEvent.setup();

      renderCartLineRow({ onIncrement, onDecrement, onRemove });

      await user.click(screen.getByRole("button", { name: /Augmenter la quantité de Sauce A \(250ml\)/i }));
      await user.click(screen.getByRole("button", { name: /Diminuer la quantité de Sauce A \(250ml\)/i }));
      await user.click(screen.getByRole("button", { name: "Retirer" }));

      expect(onIncrement).toHaveBeenCalledTimes(1);
      expect(onDecrement).toHaveBeenCalledTimes(1);
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("renders the thumbnail when sauce_image_url is set", () => {
      const thumb = "https://cdn.example/sauce.png";
      const { container } = renderCartLineRow({ line: minimalLine({ sauce_image_url: thumb }) });

      expect(container.querySelector(`img[src="${thumb}"]`)).toBeTruthy();
    });
  });

  describe("variations", () => {
    it("disables steppers and remove while busy", () => {
      renderCartLineRow({ busy: true });

      expect(screen.getByRole("button", { name: /Augmenter la quantité de Sauce A \(250ml\)/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /Diminuer la quantité de Sauce A \(250ml\)/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Retirer" })).toBeDisabled();
    });
  });
});
