import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditCategoryPage from "../../../../pages/dashboard/category/editCategoryPage";
import { ApiError } from "../../../../services/apiRequest/apiError";
import { fetchAdminCategoryById } from "../../../../services/sauces/category/categoryService";
import { useEditCategory } from "../../../../hooks/useEditCategory";
import { useToast } from "../../../../hooks/useToast";

vi.mock("../../../../services/sauces/category/categoryService", () => ({
  fetchAdminCategoryById: vi.fn(),
}));

vi.mock("../../../../hooks/useEditCategory", () => ({
  useEditCategory: vi.fn(),
}));

vi.mock("../../../../hooks/useToast", () => ({
  useToast: vi.fn(),
}));

const mockedFetchAdminCategoryById = vi.mocked(fetchAdminCategoryById);
const mockedUseEditCategory = vi.mocked(useEditCategory);
const mockedUseToast = vi.mocked(useToast);

const editCategoryByIdMock = vi.fn<(categoryId: string, name: string) => Promise<{
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
} | null>>();
const clearEditErrorMock = vi.fn();
let showSuccessMock: ReturnType<typeof vi.fn>;
let showErrorMock: ReturnType<typeof vi.fn>;

function renderPage(initialPath = "/dashboard/categories/c-1/edit") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/dashboard/categories/:id/edit" element={<EditCategoryPage />} />
        <Route path="/dashboard/categories" element={<div>Categories list</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("editCategoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchAdminCategoryById.mockResolvedValue({
      category: {
        id: "c-1",
        name: "Piquante",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    });
    editCategoryByIdMock.mockResolvedValue({
      id: "c-1",
      name: "Fumée",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    });
    mockedUseEditCategory.mockReturnValue({
      editCategoryById: editCategoryByIdMock,
      editingCategoryId: null,
      editErrorMessage: "",
      clearEditError: clearEditErrorMock,
    });
    showSuccessMock = vi.fn();
    showErrorMock = vi.fn();
    mockedUseToast.mockReturnValue({
      showSuccess: showSuccessMock,
      showError: showErrorMock,
    });
  });

  describe("nominal case", () => {
    it("loads category data and updates it", async () => {
      const user = userEvent.setup();
      renderPage();

      const input = await screen.findByLabelText("Nom de la catégorie");
      expect(input).toHaveValue("Piquante");

      await user.clear(input);
      await user.type(input, "Fumée");
      await user.click(screen.getByRole("button", { name: "Enregistrer la catégorie" }));

      await waitFor(() => {
        expect(editCategoryByIdMock).toHaveBeenCalledWith("c-1", "Fumée");
      });
      expect(showSuccessMock).toHaveBeenCalledWith("Catégorie mise à jour.");
      expect(screen.getByText("Categories list")).toBeInTheDocument();
    });
  });

  describe("variations", () => {
    it("shows not found error when route id is blank after trim", async () => {
      renderPage("/dashboard/categories/%20/edit");

      expect(await screen.findByText("Catégorie introuvable.")).toBeInTheDocument();
      expect(mockedFetchAdminCategoryById).not.toHaveBeenCalled();
    });

    it("shows loader while fetching category", () => {
      mockedFetchAdminCategoryById.mockImplementationOnce(
        () =>
          new Promise(() => {
          }),
      );
      renderPage();
      expect(screen.getByRole("status")).toHaveTextContent("Chargement de la catégorie...");
    });

    it("shows error and retry button when loading fails", async () => {
      mockedFetchAdminCategoryById.mockRejectedValueOnce(new ApiError("Erreur chargement", 500));
      const user = userEvent.setup();
      renderPage();

      expect(await screen.findByText("Erreur chargement")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Réessayer" }));

      await waitFor(() => {
        expect(mockedFetchAdminCategoryById).toHaveBeenCalledTimes(2);
      });
    });

    it("shows validation toast when submitted name is spaces only", async () => {
      const user = userEvent.setup();
      renderPage();

      const input = await screen.findByRole("textbox", { name: /nom de la catégorie/i });
      await user.clear(input);
      await user.type(input, "   ");
      await user.click(screen.getByRole("button", { name: "Enregistrer la catégorie" }));

      expect(editCategoryByIdMock).not.toHaveBeenCalled();
      expect(showErrorMock).toHaveBeenCalledWith("Le nom de catégorie est requis.");
    });

    it("does not navigate or show success when editCategoryById returns null", async () => {
      editCategoryByIdMock.mockResolvedValueOnce(null);
      const user = userEvent.setup();
      renderPage();

      const input = await screen.findByRole("textbox", { name: /nom de la catégorie/i });
      await user.clear(input);
      await user.type(input, "Fumée");
      await user.click(screen.getByRole("button", { name: "Enregistrer la catégorie" }));

      await waitFor(() => {
        expect(editCategoryByIdMock).toHaveBeenCalledWith("c-1", "Fumée");
      });
      expect(showSuccessMock).not.toHaveBeenCalled();
      expect(screen.queryByText("Categories list")).not.toBeInTheDocument();
    });

    it("renders hook edit error message", async () => {
      mockedUseEditCategory.mockReturnValue({
        editCategoryById: editCategoryByIdMock,
        editingCategoryId: null,
        editErrorMessage: "Erreur de mise à jour",
        clearEditError: clearEditErrorMock,
      });
      renderPage();

      expect(await screen.findByText("Erreur de mise à jour")).toBeInTheDocument();
    });

    it("disables input and submit while category update is in progress", async () => {
      mockedUseEditCategory.mockReturnValue({
        editCategoryById: editCategoryByIdMock,
        editingCategoryId: "c-1",
        editErrorMessage: "",
        clearEditError: clearEditErrorMock,
      });
      renderPage();

      const input = await screen.findByRole("textbox", { name: /nom de la catégorie/i });
      expect(input).toBeDisabled();
      expect(screen.getByRole("button", { name: "Enregistrement..." })).toBeDisabled();
    });
  });
});
