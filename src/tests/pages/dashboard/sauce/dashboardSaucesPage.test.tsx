import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import DashboardSaucesPage from "../../../../pages/dashboard/sauce/dashboardSaucesPage";
import { ApiError } from "../../../../services/apiRequest/apiError";
import type { SauceApiSerialized } from "../../../../types/sauce";
import { useSauceRowActions } from "../../../../hooks/useSauceRowActions";

vi.mock("../../../../services/sauces/sauceService", () => ({
  fetchSauces: vi.fn(),
}));

vi.mock("../../../../hooks/useSauceRowActions", () => ({
  useSauceRowActions: vi.fn(),
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

import { fetchSauces } from "../../../../services/sauces/sauceService";

const mockedFetchSauces = vi.mocked(fetchSauces);
const mockedUseSauceRowActions = vi.mocked(useSauceRowActions);
const clearDeleteErrorMock = vi.fn();
const getSauceRowActionPropsMock = vi.fn();

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
    mockedFetchSauces.mockResolvedValue({
      sauces: [apiSauce({ id: "s-1", name: "Sauce BBQ", image_url: "bbq.jpg" })],
    });
    getSauceRowActionPropsMock.mockImplementation((sauce: SauceApiSerialized) => ({
      deleteId: sauce.id,
      editTo: `/dashboard/sauces/${sauce.id}/edit`,
      editLabel: `Editer la sauce ${sauce.name}`,
      deleteItemName: `la sauce ${sauce.name}`,
      onDeleteById: vi.fn(),
      onDeleteSuccess: vi.fn(),
      onOpenDeleteConfirm: vi.fn(),
      isDeleting: false,
    }));
    mockedUseSauceRowActions.mockReturnValue({
      deleteErrorMessage: "",
      clearDeleteError: clearDeleteErrorMock,
      getSauceRowActionProps: getSauceRowActionPropsMock,
    });
  });

  it("renders page title, create link and fetched sauces", async () => {
    renderPage();

    expect(await screen.findByRole("heading", { name: "Sauces" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Créer une sauce" })).toHaveAttribute("href", "/dashboard/sauces/create");
    expect(screen.getByText("Sauce BBQ")).toBeInTheDocument();
    expect(screen.getByTestId("row-actions-s-1")).toBeInTheDocument();
  });

  it("loads sauces on mount", async () => {
    renderPage();

    await waitFor(() => {
      expect(mockedFetchSauces).toHaveBeenCalledTimes(1);
    });

    expect(clearDeleteErrorMock).toHaveBeenCalledTimes(1);
  });

  it("forwards mapped row-action props for each sauce", async () => {
    mockedFetchSauces.mockResolvedValue({
      sauces: [
        apiSauce({ id: "s-1", name: "Sauce BBQ", image_url: "bbq.jpg" }),
        apiSauce({ id: "s-2", name: "Sauce Miel", image_url: "miel.jpg" }),
      ],
    });

    renderPage();

    await screen.findByText("Sauce BBQ");
    expect(getSauceRowActionPropsMock).toHaveBeenCalledTimes(2);
    expect(getSauceRowActionPropsMock).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: "s-1", name: "Sauce BBQ" }));
    expect(getSauceRowActionPropsMock).toHaveBeenNthCalledWith(2, expect.objectContaining({ id: "s-2", name: "Sauce Miel" }));
  });

  it("displays delete error message from row actions hook", async () => {
    mockedUseSauceRowActions.mockReturnValue({
      deleteErrorMessage: "Suppression impossible",
      clearDeleteError: clearDeleteErrorMock,
      getSauceRowActionProps: getSauceRowActionPropsMock,
    });

    renderPage();

    expect(await screen.findByText("Suppression impossible")).toBeInTheDocument();
  });

  it("passes retry callback and reloads sauces when retry is clicked", async () => {
    mockedFetchSauces
      .mockRejectedValueOnce(new ApiError("Erreur API", 500))
      .mockResolvedValueOnce({
        sauces: [apiSauce({ id: "s-3", name: "Sauce Relance", image_url: "relance.jpg" })],
      });
    const user = userEvent.setup();

    renderPage();
    await waitFor(() => expect(mockedFetchSauces).toHaveBeenCalledTimes(1));

    await user.click(screen.getByRole("button", { name: "retry-load" }));

    await waitFor(() => expect(mockedFetchSauces).toHaveBeenCalledTimes(2));
  });

  it("renders fallback image when image_url is missing", async () => {
    mockedFetchSauces.mockResolvedValue({
      sauces: [apiSauce({ id: "s-1", name: "Sans image", image_url: null })],
    });
    renderPage();

    expect(await screen.findByRole("img", { name: "Sans image" })).toHaveAttribute("src", "/assets/bbq.jpg");
  });

  it("renders empty message when no sauce is returned", async () => {
    mockedFetchSauces.mockResolvedValue({ sauces: [] });
    renderPage();

    expect(await screen.findByText("Aucune sauce trouvée.")).toBeInTheDocument();
    expect(screen.queryByTestId("row-actions-s-1")).not.toBeInTheDocument();
  });
});
