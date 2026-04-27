import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateCategoryPage from "../../../../pages/dashboard/category/createCategoryPage";
import { ApiError } from "../../../../services/apiRequest/apiError";
import { createAdminCategory } from "../../../../services/sauces/category/categoryService";
import { useToast } from "../../../../hooks/useToast";

vi.mock("../../../../services/sauces/category/categoryService", () => ({
  createAdminCategory: vi.fn(),
}));

vi.mock("../../../../hooks/useToast", () => ({
  useToast: vi.fn(),
}));

const mockedCreateAdminCategory = vi.mocked(createAdminCategory);
const mockedUseToast = vi.mocked(useToast);
let showSuccessMock: ReturnType<typeof vi.fn>;
let showErrorMock: ReturnType<typeof vi.fn>;

function renderPage() {
  return render(
    <MemoryRouter>
      <CreateCategoryPage />
    </MemoryRouter>,
  );
}

describe("createCategoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    showSuccessMock = vi.fn();
    showErrorMock = vi.fn();
    mockedUseToast.mockReturnValue({
      showSuccess: showSuccessMock,
      showError: showErrorMock,
    });
    mockedCreateAdminCategory.mockResolvedValue({
      message: "Catégorie créée.",
      category: {
        id: "c-1",
        name: "Fumée",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    });
  });

  describe("nominal case", () => {
    it("creates category and calls onCreated callback", async () => {
      const user = userEvent.setup();
      const onCreated = vi.fn().mockResolvedValue(undefined);
      render(
        <MemoryRouter>
          <CreateCategoryPage onCreated={onCreated} />
        </MemoryRouter>,
      );

      await user.type(screen.getByLabelText("Nom de la catégorie"), "Fumée");
      await user.click(screen.getByRole("button", { name: "Ajouter la catégorie" }));

      await waitFor(() => {
        expect(mockedCreateAdminCategory).toHaveBeenCalledWith("Fumée");
      });
      expect(showSuccessMock).toHaveBeenCalledWith("Catégorie créée.");
      expect(onCreated).toHaveBeenCalledTimes(1);
    });
  });

  describe("variations", () => {
    it("shows validation toast when name is blank", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(screen.getByRole("button", { name: "Ajouter la catégorie" }));

      expect(mockedCreateAdminCategory).not.toHaveBeenCalled();
      expect(showErrorMock).toHaveBeenCalledWith("Le nom de catégorie est requis.");
    });

    it("shows API error toast when creation fails", async () => {
      mockedCreateAdminCategory.mockRejectedValue(new ApiError("Nom déjà utilisé", 422));
      const user = userEvent.setup();
      renderPage();

      await user.type(screen.getByLabelText("Nom de la catégorie"), "Fumée");
      await user.click(screen.getByRole("button", { name: "Ajouter la catégorie" }));

      await waitFor(() => {
        expect(showErrorMock).toHaveBeenCalledWith("Nom déjà utilisé");
      });
    });
  });
});
