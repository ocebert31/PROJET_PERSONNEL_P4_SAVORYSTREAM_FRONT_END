import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import type { SauceCategory } from "../../../../types/sauceCategory";
import DashboardCategoriesPage from "../../../../pages/dashboard/category/dashboardCategoriesPage";
import { ApiError } from "../../../../services/apiRequest/apiError";
import { fetchAdminCategories } from "../../../../services/sauces/category/categoryService";
import { useCategoryRowActions } from "../../../../hooks/useCategoryRowActions";

vi.mock("../../../../services/sauces/category/categoryService", () => ({
  fetchAdminCategories: vi.fn(),
}));

vi.mock("../../../../hooks/useCategoryRowActions", () => ({
  useCategoryRowActions: vi.fn(),
}));

vi.mock("../../../../common/layout/dashboardPageLayout", () => ({
  default: ({
    title,
    description,
    action,
    children,
  }: {
    title: string;
    description: string;
    action?: ReactNode;
    children: ReactNode;
  }) => (
    <section>
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{action}</div>
      <div>{children}</div>
    </section>
  ),
}));

vi.mock("../../../../common/feedback/asyncStateView", () => ({
  default: ({
    loadingLabel,
    errorMessage,
    onRetry,
  }: {
    loadingLabel: string;
    errorMessage?: string;
    onRetry?: () => void;
  }) => (
    <div data-testid="async-state-view">
      <span>{loadingLabel}</span>
      {errorMessage ? <span>{errorMessage}</span> : null}
      {onRetry ? (
        <button type="button" onClick={onRetry}>
          retry-load
        </button>
      ) : null}
    </div>
  ),
}));

vi.mock("../../../../common/button/entityRowActions", () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid={`row-actions-${String(props.deleteId)}`}>
      row-actions-{String(props.deleteId)}
    </div>
  ),
}));

const mockedFetchAdminCategories = vi.mocked(fetchAdminCategories);
const mockedUseCategoryRowActions = vi.mocked(useCategoryRowActions);

const clearDeleteErrorMock = vi.fn();
const getCategoryRowActionPropsMock = vi.fn();

function makeCategory(id: string, name: string): SauceCategory {
  return {
    id,
    name,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <DashboardCategoriesPage />
    </MemoryRouter>,
  );
}

describe("dashboardCategoriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedFetchAdminCategories.mockResolvedValue([makeCategory("c-1", "Piquante")]);
    getCategoryRowActionPropsMock.mockImplementation((category: SauceCategory) => ({
      deleteId: category.id,
      editTo: `/dashboard/categories/${category.id}/edit`,
      editLabel: `Editer la catégorie ${category.name}`,
      deleteItemName: `la catégorie ${category.name}`,
      onDeleteById: vi.fn(),
      onDeleteSuccess: vi.fn(),
      onOpenDeleteConfirm: vi.fn(),
      isDeleting: false,
    }));

    mockedUseCategoryRowActions.mockReturnValue({
      deleteErrorMessage: "",
      clearDeleteError: clearDeleteErrorMock,
      getCategoryRowActionProps: getCategoryRowActionPropsMock,
    });
  });

  it("renders page title, create link and fetched categories", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: "Catégories" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Créer une catégorie" })).toHaveAttribute("href", "/dashboard/categories/create");
    expect(screen.getByRole("heading", { name: "Liste des catégories", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Piquante")).toBeInTheDocument();
    expect(screen.getByTestId("row-actions-c-1")).toBeInTheDocument();
  });

  it("loads categories on mount", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockedFetchAdminCategories).toHaveBeenCalledTimes(1);
    });

    expect(clearDeleteErrorMock).toHaveBeenCalledTimes(1);
  });

  it("forwards mapped row-action props for each category", async () => {
    mockedFetchAdminCategories.mockResolvedValue([
      makeCategory("c-1", "Piquante"),
      makeCategory("c-2", "Fumée"),
    ]);

    renderPage();

    await screen.findByText("Piquante");
    expect(getCategoryRowActionPropsMock).toHaveBeenCalledTimes(2);
    expect(getCategoryRowActionPropsMock).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: "c-1", name: "Piquante" }));
    expect(getCategoryRowActionPropsMock).toHaveBeenNthCalledWith(2, expect.objectContaining({ id: "c-2", name: "Fumée" }));
  });

  it("displays delete error message from row actions hook", async () => {
    mockedUseCategoryRowActions.mockReturnValue({
      deleteErrorMessage: "Suppression impossible.",
      clearDeleteError: clearDeleteErrorMock,
      getCategoryRowActionProps: getCategoryRowActionPropsMock,
    });

    renderPage();

    expect(await screen.findByText("Suppression impossible.")).toBeInTheDocument();
  });

  it("passes retry callback and reloads categories when retry is clicked", async () => {
    mockedFetchAdminCategories
      .mockRejectedValueOnce(new ApiError("Erreur chargement", 500))
      .mockResolvedValueOnce([makeCategory("c-1", "Piquante")]);
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(mockedFetchAdminCategories).toHaveBeenCalledTimes(1));

    await user.click(screen.getByRole("button", { name: "retry-load" }));

    await waitFor(() => expect(mockedFetchAdminCategories).toHaveBeenCalledTimes(2));
  });

  it("renders empty message when no category is returned", async () => {
    mockedFetchAdminCategories.mockResolvedValue([]);

    renderPage();

    expect(await screen.findByText("Aucune catégorie trouvée.")).toBeInTheDocument();
  });
});
