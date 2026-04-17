import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TermsOfSalePage from "../../pages/termsOfSalePage";

describe("TermsOfSalePage", () => {
  describe("nominal case", () => {
    it("renders the page title and main sales sections", () => {
      render(<TermsOfSalePage />);
      expect(screen.getByRole("heading", { level: 1, name: /Conditions Générales de Vente/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Produits" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Prix" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Paiement" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Livraison" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Droit de rétractation" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Exceptions et remboursements" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Litiges" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Compte client" })).toBeInTheDocument();
    });
  });
});
