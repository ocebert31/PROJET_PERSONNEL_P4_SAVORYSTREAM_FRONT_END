import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MentionsLegalesPage from "../../pages/MentionsLegalesPage";

describe("MentionsLegalesPage", () => {
  describe("nominal case", () => {
    it("renders the page title and legal identity sections", () => {
      render(<MentionsLegalesPage />);
      expect(screen.getByRole("heading", { level: 1, name: "Mentions légales" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Éditeur du site" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Informations entreprise" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Responsable de publication" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: /Hébergement frontend/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: /Hébergement backend/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Propriété intellectuelle" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Limitation de responsabilité" })).toBeInTheDocument();
    });
  });
});
