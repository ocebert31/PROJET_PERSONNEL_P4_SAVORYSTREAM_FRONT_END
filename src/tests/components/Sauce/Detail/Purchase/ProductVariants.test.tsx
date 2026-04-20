import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProductVariants from "../../../../../components/Sauce/Detail/Purchase/ProductVariants";

const VARIANT_A_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const VARIANT_B_ID = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

const variants = [
  { id: VARIANT_A_ID, volume: "250ml", prix: 3 },
  { id: VARIANT_B_ID, volume: "500ml", prix: 5 },
];

describe("ProductVariants", () => {
  it("calls onSelect with variant id when clicked", async () => {
    const onSelect = vi.fn();
    render(<ProductVariants variants={variants} selectedId={VARIANT_A_ID} onSelect={onSelect} isAvailable />);
    await userEvent.click(screen.getByRole("button", { name: /500ml/i }));
    expect(onSelect).toHaveBeenCalledWith(VARIANT_B_ID);
  });

  it("disables buttons when not available", () => {
    render(<ProductVariants variants={variants} selectedId={null} onSelect={vi.fn()} isAvailable={false} />);
    screen.getAllByRole("button").forEach((btn) => expect(btn).toBeDisabled());
  });
});
