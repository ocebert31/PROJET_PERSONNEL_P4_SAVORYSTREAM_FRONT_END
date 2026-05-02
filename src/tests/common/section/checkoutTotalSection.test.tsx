import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CheckoutTotalSection from "../../../common/section/checkoutTotalSection";

describe("CheckoutTotalSection", () => {
  describe("nominal case", () => {
    it("renders default label and formatted amount", () => {
      render(<CheckoutTotalSection amount={42.5} />);

      expect(screen.getByText("Total")).toBeInTheDocument();
      expect(screen.getByText("42.50 €")).toBeInTheDocument();
    });

    it("renders a custom label", () => {
      render(<CheckoutTotalSection amount={10} label="À payer" />);

      expect(screen.getByText("À payer")).toBeInTheDocument();
      expect(screen.getByText("10.00 €")).toBeInTheDocument();
    });

    it("renders optional detail below the amount", () => {
      render(<CheckoutTotalSection amount={1} detail={<span>Frais de port inclus</span>} />);

      expect(screen.getByText("Frais de port inclus")).toBeInTheDocument();
    });
  });
});
