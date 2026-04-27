import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import DashboardSaucesPage from "../../../../pages/dashboard/sauce/dashboardSaucesPage";
import { ApiError } from "../../../../services/apiRequest/apiError";
import type { SauceApiSerialized } from "../../../../types/sauce";

vi.mock("../../../../services/sauces/sauceService", () => ({
  fetchSauces: vi.fn(),
}));

import { fetchSauces } from "../../../../services/sauces/sauceService";

const mockedFetchSauces = vi.mocked(fetchSauces);

function apiSauce(partial: Partial<SauceApiSerialized> & Pick<SauceApiSerialized, "id" | "name">): SauceApiSerialized {
  return {
    id: partial.id,
    name: partial.name,
    tagline: partial.tagline ?? "",
    description: partial.description ?? null,
    characteristic: partial.characteristic ?? null,
    image_url: partial.image_url ?? null,
    is_available: partial.is_available ?? true,
    category: partial.category ?? null,
    stock: partial.stock ?? null,
    conditionings: partial.conditionings ?? [],
    ingredients: partial.ingredients ?? [],
    created_at: partial.created_at ?? "2026-01-01T00:00:00.000Z",
    updated_at: partial.updated_at ?? "2026-01-01T00:00:00.000Z",
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <DashboardSaucesPage />
    </MemoryRouter>,
  );
}

describe("dashboardSaucesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("renders sauces with image, title and edit link", async () => {
      mockedFetchSauces.mockResolvedValue({
        sauces: [
          apiSauce({ id: "s-1", name: "Sauce BBQ", image_url: "bbq.jpg" }),
          apiSauce({ id: "s-2", name: "Sauce Miel", image_url: "miel.jpg" }),
        ],
      });

      renderPage();

      expect(await screen.findByRole("heading", { name: "Sauces" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Créer une sauce" })).toHaveAttribute("href", "/dashboard/sauces/create");
      expect(screen.getByRole("img", { name: "Sauce BBQ" })).toHaveAttribute("src", "bbq.jpg");
      expect(screen.getByRole("img", { name: "Sauce Miel" })).toHaveAttribute("src", "miel.jpg");

      expect(screen.getByRole("link", { name: "Editer la sauce Sauce BBQ" })).toHaveAttribute(
        "href",
        "/dashboard/sauces/s-1/edit",
      );
      expect(screen.getByRole("link", { name: "Editer la sauce Sauce Miel" })).toHaveAttribute(
        "href",
        "/dashboard/sauces/s-2/edit",
      );
    });
  });

  describe("variations", () => {
    it("shows loading state while sauces are being fetched", () => {
      mockedFetchSauces.mockImplementationOnce(
        () =>
          new Promise(() => {
          }),
      );

      const { container } = renderPage();

      expect(screen.getByRole("status")).toHaveTextContent("Chargement des sauces...");
      expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
      expect(screen.queryByText("Aucune sauce trouvée.")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Réessayer" })).not.toBeInTheDocument();
    });

    it("shows empty state when no sauce exists", async () => {
      mockedFetchSauces.mockResolvedValue({ sauces: [] });
      renderPage();
      expect(await screen.findByText("Aucune sauce trouvée.")).toBeInTheDocument();
    });

    it("uses fallback image when image_url is null", async () => {
      mockedFetchSauces.mockResolvedValue({
        sauces: [apiSauce({ id: "s-1", name: "Sans image", image_url: null })],
      });
      renderPage();
      expect(await screen.findByRole("img", { name: "Sans image" })).toHaveAttribute("src", "/assets/bbq.jpg");
    });

    it("shows API error and retries successfully", async () => {
      mockedFetchSauces
        .mockRejectedValueOnce(new ApiError("Erreur API", 500))
        .mockResolvedValueOnce({
          sauces: [apiSauce({ id: "s-3", name: "Sauce Relance", image_url: "relance.jpg" })],
        });

      const user = userEvent.setup();
      renderPage();

      expect(await screen.findByText("Erreur API")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Réessayer" }));

      await waitFor(() => {
        expect(screen.getByText("Sauce Relance")).toBeInTheDocument();
      });
      expect(mockedFetchSauces).toHaveBeenCalledTimes(2);
    });
  });
});
