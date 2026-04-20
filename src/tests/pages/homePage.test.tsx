import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../../pages/homePage";
import { MemoryRouter } from "react-router-dom";
import type { SauceApiSerialized } from "../../types/sauce";
import { ApiError } from "../../services/apiRequest/apiError";

vi.mock("../../services/sauces/sauceService", () => ({
  fetchSauces: vi.fn(),
}));

import { fetchSauces } from "../../services/sauces/sauceService";

const mockedFetchSauces = vi.mocked(fetchSauces);

function apiSauce(partial: Partial<SauceApiSerialized> & Pick<SauceApiSerialized, "id" | "name">): SauceApiSerialized {
  return {
    id: partial.id,
    name: partial.name,
    tagline: partial.tagline ?? "Accroche par défaut",
    description: partial.description ?? null,
    characteristic: partial.characteristic ?? null,
    image_url: partial.image_url ?? "test-image.jpg",
    is_available: partial.is_available ?? true,
    category: partial.category ?? null,
    stock: partial.stock ?? null,
    conditionings: partial.conditionings ?? [{ id: "cond-1", volume: "250ml", price: "3.99" }],
    ingredients: partial.ingredients ?? [],
    created_at: partial.created_at ?? "2026-01-01T00:00:00.000Z",
    updated_at: partial.updated_at ?? "2026-01-01T00:00:00.000Z",
  };
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchSauces.mockResolvedValue({
      sauces: [
        apiSauce({
          id: "11111111-1111-1111-1111-111111111111",
          name: "Sauce Barbecue",
          tagline: "Une sauce fumée et légèrement sucrée",
          image_url: "test-image1.jpg",
          is_available: true,
          conditionings: [{ id: "c1", volume: "250ml", price: "3.99" }],
        }),
        apiSauce({
          id: "22222222-2222-2222-2222-222222222222",
          name: "Sauce Samurai",
          tagline: "Une sauce épicée qui réveille les papilles",
          image_url: "test-image2.jpg",
          is_available: false,
          conditionings: [{ id: "c2", volume: "250ml", price: "4.49" }],
        }),
        apiSauce({
          id: "33333333-3333-3333-3333-333333333333",
          name: "Sauce Mystère",
          tagline: "Une sauce dont on ne révèle jamais le secret...",
          image_url: "test-image3.jpg",
          is_available: true,
          conditionings: [],
        }),
      ],
    });
  });

  const renderHomePage = () =>
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

  it("should render the main title after the catalogue loads", async () => {
    renderHomePage();
    expect(await screen.findByText("Nos Sauces Maison 🍶")).toBeInTheDocument();
  });

  it("should render all sauces from the API", async () => {
    renderHomePage();
    await waitFor(() => {
      expect(screen.getByText("Sauce Barbecue")).toBeInTheDocument();
      expect(screen.getByText("Sauce Samurai")).toBeInTheDocument();
      expect(screen.getByText("Sauce Mystère")).toBeInTheDocument();
    });
  });

  it("should render sauce images with correct alt text", async () => {
    renderHomePage();
    const images = await screen.findAllByRole("img");
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute("alt", "Sauce Barbecue");
    expect(images[1]).toHaveAttribute("alt", "Sauce Samurai");
    expect(images[2]).toHaveAttribute("alt", "Sauce Mystère");
  });

  it("should display the price for sauces with conditionnements", async () => {
    renderHomePage();
    expect(await screen.findByText("3.99 €")).toBeInTheDocument();
    expect(screen.getByText("4.49 €")).toBeInTheDocument();
  });

  it("should display 'N/A €' when no conditionnement is available", async () => {
    renderHomePage();
    expect(await screen.findByText("N/A €")).toBeInTheDocument();
  });

  it("should display 'Disponible' for available sauces", async () => {
    renderHomePage();
    await screen.findByText("Nos Sauces Maison 🍶");
    const availableBadges = screen.getAllByText("Disponible");
    expect(availableBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("should display 'En rupture' for unavailable sauces", async () => {
    renderHomePage();
    expect(await screen.findByText("En rupture")).toBeInTheDocument();
  });

  it("should display a loading message while catalogue is being fetched", async () => {
    let resolveFetch: ((value: { sauces: SauceApiSerialized[] }) => void) | undefined;
    mockedFetchSauces.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );

    renderHomePage();

    expect(screen.getByRole("status")).toHaveTextContent("Chargement du catalogue…");

    resolveFetch?.({
      sauces: [apiSauce({ id: "44444444-4444-4444-4444-444444444444", name: "Sauce Test" })],
    });

    expect(await screen.findByText("Nos Sauces Maison 🍶")).toBeInTheDocument();
  });

  it("should display ApiError message and allow retry", async () => {
    mockedFetchSauces
      .mockRejectedValueOnce(new ApiError("Service indisponible", 503))
      .mockResolvedValueOnce({
        sauces: [apiSauce({ id: "55555555-5555-5555-5555-555555555555", name: "Sauce Relance" })],
      });

    const user = userEvent.setup();
    renderHomePage();

    expect(await screen.findByText("Service indisponible")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Réessayer" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Réessayer" }));

    expect(await screen.findByText("Sauce Relance")).toBeInTheDocument();
    expect(screen.queryByText("Service indisponible")).not.toBeInTheDocument();
    expect(mockedFetchSauces).toHaveBeenCalledTimes(2);
  });

  it("should display fallback message when rejection is not an Error", async () => {
    mockedFetchSauces.mockRejectedValueOnce("network-failure");

    renderHomePage();

    expect(await screen.findByText("Impossible de charger les sauces.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Réessayer" })).toBeInTheDocument();
  });

  it("should display native Error message when fetch fails", async () => {
    mockedFetchSauces.mockRejectedValueOnce(new Error("network down"));

    renderHomePage();

    expect(await screen.findByText("network down")).toBeInTheDocument();
  });

  it("should keep catalogue visible with title when API returns an empty list", async () => {
    mockedFetchSauces.mockResolvedValueOnce({ sauces: [] });

    renderHomePage();

    expect(await screen.findByText("Nos Sauces Maison 🍶")).toBeInTheDocument();
    expect(screen.queryByText("Chargement du catalogue…")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Réessayer" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Coup de cœur du moment/i })).toHaveAttribute("href", "/");
  });
});
