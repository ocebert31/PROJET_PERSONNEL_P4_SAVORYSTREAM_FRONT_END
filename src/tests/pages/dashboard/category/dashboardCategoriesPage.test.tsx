import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import DashboardCategoriesPage from "../../../../pages/dashboard/category/dashboardCategoriesPage";
import { ApiError } from "../../../../services/apiRequest/apiError";
import { createAdminCategory, fetchAdminCategories } from "../../../../services/sauces/category/categoryService";
import { useToast } from "../../../../hooks/useToast";

vi.mock("../../../../services/sauces/category/categoryService", () => ({
  fetchAdminCategories: vi.fn(),
  createAdminCategory: vi.fn(),
}));

vi.mock("../../../../hooks/useToast", () => ({
  useToast: vi.fn(),
}));

const mockedFetchAdminCategories = vi.mocked(fetchAdminCategories);
const mockedCreateAdminCategory = vi.mocked(createAdminCategory);
const mockedUseToast = vi.mocked(useToast);
let showSuccessMock: ReturnType<typeof vi.fn>;
let showErrorMock: ReturnType<typeof vi.fn>;

function renderPage() {
  return render(
    <MemoryRouter>
      <DashboardCategoriesPage />
    </MemoryRouter>,
  );
}

function category(id: string, name: string) {
  return {
    id,
    name,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("dashboardCategoriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    showSuccessMock = vi.fn();
    showErrorMock = vi.fn();
    mockedUseToast.mockReturnValue({
      showSuccess: showSuccessMock,
      showError: showErrorMock,
    });
    mockedFetchAdminCategories.mockResolvedValue([category("c-1", "Piquante")]);
    mockedCreateAdminCategory.mockResolvedValue({
      message: "Catégorie créée.",
      category: category("c-2", "Fumée"),
    });
  });

  describe("nominal case", () => {
    it("loads categories and creates a new category through embedded create component", async () => {
      const user = userEvent.setup();
      renderPage();

      expect(await screen.findByRole("heading", { name: "Catégories" })).toBeInTheDocument();
      expect(screen.getByText("Piquante")).toBeInTheDocument();

      await user.type(screen.getByLabelText("Nom de la catégorie"), "Fumée");
      await user.click(screen.getByRole("button", { name: "Ajouter la catégorie" }));

      await waitFor(() => {
        expect(mockedCreateAdminCategory).toHaveBeenCalledWith("Fumée");
      });
      expect(mockedFetchAdminCategories).toHaveBeenCalledTimes(2);
      expect(showSuccessMock).toHaveBeenCalledWith("Catégorie créée.");
    });
  });

  describe("variations", () => {
    it("shows loading state while categories are being fetched", () => {
      mockedFetchAdminCategories.mockImplementationOnce(
        () =>
          new Promise(() => {
          }),
      );

      const { container } = renderPage();

      expect(screen.getByRole("status")).toHaveTextContent("Chargement des catégories...");
      expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
      expect(screen.queryByText("Aucune catégorie trouvée.")).not.toBeInTheDocument();
    });

    it("shows empty state when no category exists", async () => {
      mockedFetchAdminCategories.mockResolvedValue([]);
      renderPage();
      expect(await screen.findByText("Aucune catégorie trouvée.")).toBeInTheDocument();
    });

    it("shows load error and retries successfully", async () => {
      mockedFetchAdminCategories
        .mockRejectedValueOnce(new ApiError("Erreur chargement", 500))
        .mockResolvedValueOnce([category("c-1", "Piquante")]);
      const user = userEvent.setup();
      renderPage();

      expect(await screen.findByText("Erreur chargement")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Réessayer" }));

      expect(await screen.findByText("Piquante")).toBeInTheDocument();
      expect(mockedFetchAdminCategories).toHaveBeenCalledTimes(2);
    });

    it("keeps embedded create form visible when categories are empty", async () => {
      mockedFetchAdminCategories.mockResolvedValue([]);
      renderPage();
      expect(await screen.findByText("Aucune catégorie trouvée.")).toBeInTheDocument();
      expect(screen.getByLabelText("Nom de la catégorie")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Ajouter la catégorie" })).toBeInTheDocument();
    });
  });
});
