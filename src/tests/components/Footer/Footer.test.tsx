import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "../../../components/Footer/Footer";
import { MemoryRouter } from "react-router-dom";

describe("Footer", () => {
  it("renders brand and reassurance items", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    expect(screen.getByText("SavoryStream")).toBeInTheDocument();
    expect(screen.getByText("Paiement sécurisé")).toBeInTheDocument();
    expect(screen.getByText(/© \d{4} SavoryStream/)).toBeInTheDocument();
  });

  it("renders legal links with expected hrefs", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Mentions légales" })).toHaveAttribute("href", "/mentions-legales");
    expect(screen.getByRole("link", { name: "Confidentialité" })).toHaveAttribute("href", "/confidentialite");
    expect(screen.getByRole("link", { name: "CGV" })).toHaveAttribute("href", "/cgv");
    expect(screen.getByRole("link", { name: "Cookies" })).toHaveAttribute("href", "/cookies");
  });
});
