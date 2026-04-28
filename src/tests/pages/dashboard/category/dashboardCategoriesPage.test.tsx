import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DashboardCategoriesPage from "../../../../pages/dashboard/category/dashboardCategoriesPage";
import { ApiError } from "../../../../services/apiRequest/apiError";
import { fetchAdminCategories } from "../../../../services/sauces/category/categoryService";
import { useDeleteCategory } from "../../../../hooks/useDeleteCategory";

vi.mock("../../../../services/sauces/category/categoryService", () => ({
  fetchAdminCategories: vi.fn(),
}));

vi.mock("../../../../hooks/useDeleteCategory", () => ({
  useDeleteCategory: vi.fn(),
}));

vi.mock("../../../../common/button/EntityRowActions", () => ({
  default: ({
    editTo,
    editLabel,
    deleteId,
    onDeleteById,
    onDeleteSuccess,
  }: {
    editTo: string;
    editLabel: string;
    deleteId: string;
    onDeleteById: (id: string) => Promise<boolean>;
    onDeleteSuccess?: (id: string) => void;
  }) => (
    <div data-testid={`row-actions-${deleteId}`}>
      <span>{editLabel}</span>
      <span>{editTo}</span>
      <button
        type="button"
        onClick={async () => {
          const wasDeleted = await onDeleteById(deleteId);
          if (wasDeleted) {
            onDeleteSuccess?.(deleteId);
          }
        }}
      >
        trigger-delete-{deleteId}
      </button>
    </div>
  ),
}));

const mockedFetchAdminCategories = vi.mocked(fetchAdminCategories);
const mockedUseDeleteCategory = vi.mocked(useDeleteCategory);
const deleteCategoryByIdMock = vi.fn<(id: string) => Promise<boolean>>();
const clearDeleteErrorMock = vi.fn();

function renderPage() {
  return render(
    <MemoryRouter>
      <DashboardCategoriesPage />
    </MemoryRouter>,
  );
}

function renderPageWithRoutes() {
  return render(
    <MemoryRouter initialEntries={["/dashboard/categories"]}>
      <Routes>
        <Route path="/dashboard/categories" element={<DashboardCategoriesPage />} />
        <Route path="/dashboard/categories/create" element={<div>Create Category Page</div>} />
      </Routes>
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
    mockedFetchAdminCategories.mockResolvedValue([category("c-1", "Piquante")]);
    mockedUseDeleteCategory.mockReturnValue({
      deleteCategoryById: deleteCategoryByIdMock,
      deletingCategoryId: null,
      deleteErrorMessage: "",
      clearDeleteError: clearDeleteErrorMock,
    });
    deleteCategoryByIdMock.mockResolvedValue(true);
  });

  describe("nominal case", () => {
    it("loads categories and displays create navigation button", async () => {
      renderPage();

      expect(await screen.findByRole("heading", { name: "Catégories" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Créer une catégorie" })).toHaveAttribute("href", "/dashboard/categories/create");
      expect(screen.getByText("Piquante")).toBeInTheDocument();
      expect(screen.getByTestId("row-actions-c-1")).toBeInTheDocument();
      expect(screen.getByText("Editer la catégorie Piquante")).toBeInTheDocument();
      expect(screen.getByText("/dashboard/categories/c-1/edit")).toBeInTheDocument();
    });

    it("navigates to create category route when create button is clicked", async () => {
      const user = userEvent.setup();
      renderPageWithRoutes();

      await screen.findByRole("heading", { name: "Catégories" });
      await user.click(screen.getByRole("link", { name: "Créer une catégorie" }));

      expect(screen.getByText("Create Category Page")).toBeInTheDocument();
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

    it("keeps create button visible when categories are empty", async () => {
      mockedFetchAdminCategories.mockResolvedValue([]);
      renderPage();
      expect(await screen.findByText("Aucune catégorie trouvée.")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Créer une catégorie" })).toBeInTheDocument();
    });

    it("removes row when delete action succeeds", async () => {
      mockedFetchAdminCategories.mockResolvedValue([
        category("c-1", "Piquante"),
        category("c-2", "Fumée"),
      ]);
      const user = userEvent.setup();

      renderPage();
      await screen.findByText("Piquante");
      await user.click(screen.getByRole("button", { name: "trigger-delete-c-1" }));

      await waitFor(() => {
        expect(deleteCategoryByIdMock).toHaveBeenCalledWith("c-1");
      });
      expect(screen.queryByText("Piquante")).not.toBeInTheDocument();
      expect(screen.getByText("Fumée")).toBeInTheDocument();
    });
  });
});
