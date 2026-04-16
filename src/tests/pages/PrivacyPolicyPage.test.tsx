import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPolicyPage from "../../pages/PrivacyPolicyPage";

describe("PrivacyPolicyPage", () => {
  describe("nominal case", () => {
    it("renders the page title and RGPD core sections", () => {
      render(<PrivacyPolicyPage />);
      expect(screen.getByRole("heading", { level: 1, name: "Politique de confidentialité" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Responsable du traitement" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Données collectées" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Finalités de traitement" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Bases légales (RGPD)" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Durée de conservation" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Partage des données" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Droits des utilisateurs" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Cookies" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Sécurité" })).toBeInTheDocument();
    });
  });
});
