import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import FooterLegalLinks from "../../../components/Footer/FooterLegalLinks";

describe("FooterLegalLinks", () => {
  describe("nominal case", () => {
    it("renders legal navigation links with expected destinations", () => {
      render(
        <MemoryRouter>
          <FooterLegalLinks />
        </MemoryRouter>,
      );
      expect(screen.getByRole("navigation", { name: "Liens légaux" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Mentions légales" })).toHaveAttribute("href", "/mentions-legales");
      expect(screen.getByRole("link", { name: "Confidentialité" })).toHaveAttribute("href", "/confidentialite");
      expect(screen.getByRole("link", { name: "CGV" })).toHaveAttribute("href", "/cgv");
      expect(screen.getByRole("link", { name: "Cookies" })).toHaveAttribute("href", "/cookies");
    });
  });
});
