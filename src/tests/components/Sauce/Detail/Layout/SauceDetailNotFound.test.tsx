import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SauceDetailNotFound from "../../../../../components/Sauce/Detail/Layout/SauceDetailNotFound";

describe("SauceDetailNotFound", () => {
  it("renders message and link to home", () => {
    render(
      <MemoryRouter>
        <SauceDetailNotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("Sauce introuvable")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Retour à l’accueil/i })).toHaveAttribute("href", "/");
  });
});
