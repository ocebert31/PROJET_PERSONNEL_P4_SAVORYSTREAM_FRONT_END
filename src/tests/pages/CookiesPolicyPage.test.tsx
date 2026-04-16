import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CookiesPolicyPage from "../../pages/CookiesPolicyPage";

describe("CookiesPolicyPage", () => {
  describe("nominal case", () => {
    it("renders the page title and key cookie sections", () => {
      render(<CookiesPolicyPage />);
      expect(screen.getByRole("heading", { level: 1, name: "Politique cookies" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Types de cookies" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Consentement" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2, name: "Refus et paramétrage" })).toBeInTheDocument();
    });
  });
});
