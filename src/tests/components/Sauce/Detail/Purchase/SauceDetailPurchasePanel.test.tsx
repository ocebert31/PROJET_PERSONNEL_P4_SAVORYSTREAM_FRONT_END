import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Sauce } from "../../../../../types/sauce";
import SauceDetailPurchasePanel from "../../../../../components/Sauce/Detail/Purchase/SauceDetailPurchasePanel";

vi.mock("@/components/Sauce/Detail/Purchase/AddToCartButton", () => ({
  default: () => <button type="button">Ajouter au panier</button>,
}));

const SAUCE_UUID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const COND_SMALL_UUID = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const COND_LARGE_UUID = "cccccccc-cccc-cccc-cccc-cccccccccccc";

const baseSauce: Sauce = {
  id: SAUCE_UUID,
  name: "Sauce BBQ",
  description: "Une sauce fumée pour vos grillades.",
  image_url: "/bbq.jpg",
  is_available: true,
  conditionnements: [
    { id: COND_SMALL_UUID, volume: "250ml", prix: 3.99 },
    { id: COND_LARGE_UUID, volume: "500ml", prix: 6.49 },
  ],
};

describe("SauceDetailPurchasePanel", () => {
  it("renders title, description and format section", () => {
    const setSelectedCond = vi.fn();
    const setQuantity = vi.fn();
    render(
      <SauceDetailPurchasePanel
        sauce={baseSauce}
        selected={baseSauce.conditionnements[0]}
        selectedCond={COND_SMALL_UUID}
        quantity={1}
        setSelectedCond={setSelectedCond}
        setQuantity={setQuantity}
      />
    );

    expect(screen.getByRole("heading", { level: 1, name: "Sauce BBQ" })).toBeInTheDocument();
    expect(screen.getByText("Une sauce fumée pour vos grillades.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Choisis ton format/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /250ml/i })).toBeInTheDocument();
  });

  it("shows unavailable notice when sauce is not available", () => {
    render(
      <SauceDetailPurchasePanel
        sauce={{ ...baseSauce, is_available: false }}
        selected={baseSauce.conditionnements[0]}
        selectedCond={COND_SMALL_UUID}
        quantity={1}
        setSelectedCond={vi.fn()}
        setQuantity={vi.fn()}
      />
    );
    expect(
      screen.getByText(/Cette sauce n’est pas disponible pour le moment/i)
    ).toBeInTheDocument();
  });

  it("does not render buy section when no conditioning is selected", () => {
    render(
      <SauceDetailPurchasePanel
        sauce={baseSauce}
        selected={undefined}
        selectedCond={null}
        quantity={1}
        setSelectedCond={vi.fn()}
        setQuantity={vi.fn()}
      />
    );
    expect(screen.queryByRole("button", { name: /Ajouter au panier/i })).not.toBeInTheDocument();
  });

  it("renders buy section when a conditioning is selected", () => {
    render(
      <SauceDetailPurchasePanel
        sauce={baseSauce}
        selected={baseSauce.conditionnements[0]}
        selectedCond={COND_SMALL_UUID}
        quantity={2}
        setSelectedCond={vi.fn()}
        setQuantity={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /Ajouter au panier/i })).toBeInTheDocument();
  });

  it("calls setSelectedCond and resets quantity when choosing another variant", async () => {
    const setSelectedCond = vi.fn();
    const setQuantity = vi.fn();
    render(
      <SauceDetailPurchasePanel
        sauce={baseSauce}
        selected={baseSauce.conditionnements[0]}
        selectedCond={COND_SMALL_UUID}
        quantity={1}
        setSelectedCond={setSelectedCond}
        setQuantity={setQuantity}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /500ml/i }));
    expect(setSelectedCond).toHaveBeenCalledWith(COND_LARGE_UUID);
    expect(setQuantity).toHaveBeenCalledWith(1);
  });
});
