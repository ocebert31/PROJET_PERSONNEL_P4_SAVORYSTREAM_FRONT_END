import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import HomeHero from "../../../components/Home/HomeHero";

function renderHero(props: { backgroundImageUrl: string; featuredSauceId: string | undefined }) {
  return render(
    <MemoryRouter>
      <HomeHero {...props} />
    </MemoryRouter>
  );
}

const FEATURED_SAUCE_UUID = "77777777-7777-7777-7777-777777777777";

describe("HomeHero", () => {
  it("renders headline, intro copy and primary CTA anchor", () => {
    renderHero({ backgroundImageUrl: "/assets/hero.jpg", featuredSauceId: FEATURED_SAUCE_UUID });

    expect(screen.getByText("Artisanal · Sans compromis")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: /L’art de la sauce/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Découvrez des recettes équilibrées/i)
    ).toBeInTheDocument();
    const catalogueLink = screen.getByRole("link", { name: /Voir la sélection/i });
    expect(catalogueLink).toHaveAttribute("href", "#catalogue");
  });

  it("applies background image from props", () => {
    const { container } = renderHero({ backgroundImageUrl: "/custom-bg.png", featuredSauceId: FEATURED_SAUCE_UUID });
    const bgLayer = container.querySelector("section > div");
    expect(bgLayer).toHaveStyle({ backgroundImage: "url(/custom-bg.png)" });
  });

  it("links featured sauce to /sauce/:id when id is defined", () => {
    renderHero({ backgroundImageUrl: "/x.jpg", featuredSauceId: FEATURED_SAUCE_UUID });
    expect(screen.getByRole("link", { name: /Coup de cœur du moment/i })).toHaveAttribute(
      "href",
      `/sauce/${FEATURED_SAUCE_UUID}`
    );
  });

  it("links featured CTA to home when featuredSauceId is undefined", () => {
    renderHero({ backgroundImageUrl: "/x.jpg", featuredSauceId: undefined });
    expect(screen.getByRole("link", { name: /Coup de cœur du moment/i })).toHaveAttribute("href", "/");
  });
});
