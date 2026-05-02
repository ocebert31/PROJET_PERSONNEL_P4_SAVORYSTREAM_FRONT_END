import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CheckoutPageLayout, { CHECKOUT_PAGE_SHELL_CLASS } from "../../../common/layout/checkoutPageLayout";

describe("CheckoutPageLayout", () => {
  describe("nominal case", () => {
    it("renders title, subtitle, header actions and children", () => {
      render(
        <CheckoutPageLayout
          title="Panier"
          subtitle="2 articles"
          headerActions={<button type="button">Vider</button>}
        >
          <p>Corps de page</p>
        </CheckoutPageLayout>,
      );

      expect(screen.getByRole("heading", { level: 1, name: "Panier" })).toBeInTheDocument();
      expect(screen.getByText("2 articles")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Vider" })).toBeInTheDocument();
      expect(screen.getByText("Corps de page")).toBeInTheDocument();
    });

    it("applies CHECKOUT_PAGE_SHELL_CLASS on the root for both layout modes", () => {
      const tokens = CHECKOUT_PAGE_SHELL_CLASS.split(/\s+/).filter(Boolean);

      const full = render(
        <CheckoutPageLayout title="A">
          <p>x</p>
        </CheckoutPageLayout>,
      );
      expect(full.container.firstElementChild).toHaveClass(...tokens);

      full.unmount();

      const compact = render(
        <CheckoutPageLayout title="B" compactHeader>
          <p>y</p>
        </CheckoutPageLayout>,
      );
      expect(compact.container.firstElementChild).toHaveClass(...tokens);
    });

    it("renders ReactNode subtitles inside the muted subtitle slot", () => {
      render(
        <CheckoutPageLayout title="Étape" subtitle={<span data-testid="rich-sub">Récapitulatif</span>}>
          <p>Suite</p>
        </CheckoutPageLayout>,
      );

      expect(screen.getByTestId("rich-sub")).toHaveTextContent("Récapitulatif");
      expect(screen.getByTestId("rich-sub").parentElement).toHaveClass("text-body-sm", "mt-1", "text-muted");
    });

    it("places children after the header row in default layout", () => {
      const { container } = render(
        <CheckoutPageLayout title="T" subtitle="S">
          <p data-testid="main">Body</p>
        </CheckoutPageLayout>,
      );

      const root = container.firstElementChild!;
      const heading = screen.getByRole("heading", { name: "T" });
      const body = screen.getByTestId("main");

      expect(root.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(heading.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe("optional header slots", () => {
    it("does not render a subtitle block when subtitle is omitted", () => {
      const { container } = render(
        <CheckoutPageLayout title="Panier">
          <p>Only body</p>
        </CheckoutPageLayout>,
      );

      expect(container.querySelector(".text-body-sm.mt-1.text-muted")).toBeNull();
      expect(screen.getByText("Only body")).toBeInTheDocument();
    });

    it("does not render a subtitle block when subtitle is an empty string", () => {
      const { container } = render(
        <CheckoutPageLayout title="Panier" subtitle="">
          <p>Body</p>
        </CheckoutPageLayout>,
      );

      expect(container.querySelector(".text-body-sm.mt-1.text-muted")).toBeNull();
    });

    it("does not render header actions wrapper when headerActions is omitted", () => {
      const { container } = render(
        <CheckoutPageLayout title="Paiement" subtitle="Carte">
          <p>Formulaire</p>
        </CheckoutPageLayout>,
      );

      expect(container.querySelector(".flex.flex-wrap.gap-3")).toBeNull();
    });
  });

  describe("compactHeader", () => {
    it("renders only the title above children and ignores subtitle and headerActions", () => {
      render(
        <CheckoutPageLayout title="Panier" compactHeader subtitle="Ignored" headerActions={<span>Ombre</span>}>
          <p>État de chargement</p>
        </CheckoutPageLayout>,
      );

      expect(screen.queryByText("Ignored")).not.toBeInTheDocument();
      expect(screen.queryByText("Ombre")).not.toBeInTheDocument();
      expect(screen.getByText("État de chargement")).toBeInTheDocument();
    });

    it("places children immediately after the title", () => {
      render(
        <CheckoutPageLayout title="Panier" compactHeader>
          <p data-testid="below-title">Async block</p>
        </CheckoutPageLayout>,
      );

      const h1 = screen.getByRole("heading", { level: 1, name: "Panier" });
      const block = screen.getByTestId("below-title");

      expect(h1.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });
});
