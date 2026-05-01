import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditSaucePage from "../../../../pages/dashboard/sauce/editSaucePage";
import {
  fetchSauce,
  createSauceConditioning,
  createSauceIngredient,
  updateSauce,
  updateSauceConditioning,
  deleteSauceConditioning,
  updateSauceIngredient,
  deleteSauceIngredient,
} from "../../../../services/sauces/sauceService";
import { ApiError } from "../../../../services/apiRequest/apiError";
import type { SauceApiSerialized } from "../../../../types/sauce";

const hoisted = vi.hoisted(() => ({
  navigate: vi.fn(),
  categoriesState: {
    error: null as string | null,
    categoriesBlocked: false,
  },
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => hoisted.navigate,
  };
});

const showSuccess = vi.fn();
const showError = vi.fn();

vi.mock("../../../../hooks/useToast", () => ({
  useToast: () => ({ showSuccess, showError }),
}));

vi.mock("../../../../hooks/useGetSauceCategories", () => ({
  useGetSauceCategories: () => ({
    error: hoisted.categoriesState.error,
    selectOptions: [
      { value: "cat-1", label: "Catégorie test" },
      { value: "cat-2", label: "Autre" },
    ],
    categoriesBlocked: hoisted.categoriesState.categoriesBlocked,
  }),
}));

vi.mock("../../../../services/sauces/sauceService", () => ({
  fetchSauce: vi.fn(),
  createSauceConditioning: vi.fn(),
  createSauceIngredient: vi.fn(),
  updateSauce: vi.fn(),
  updateSauceConditioning: vi.fn(),
  deleteSauceConditioning: vi.fn(),
  updateSauceIngredient: vi.fn(),
  deleteSauceIngredient: vi.fn(),
}));

const fetchSauceMock = vi.mocked(fetchSauce);
const createSauceConditioningMock = vi.mocked(createSauceConditioning);
const createSauceIngredientMock = vi.mocked(createSauceIngredient);
const updateSauceConditioningMock = vi.mocked(updateSauceConditioning);
const deleteSauceConditioningMock = vi.mocked(deleteSauceConditioning);
const updateSauceIngredientMock = vi.mocked(updateSauceIngredient);
const deleteSauceIngredientMock = vi.mocked(deleteSauceIngredient);
const updateSauceMock = vi.mocked(updateSauce);

const EDIT_UUID = "11111111-2222-3333-4444-555555555555";

function apiSauce(overrides: Partial<SauceApiSerialized> = {}): SauceApiSerialized {
  return {
    id: EDIT_UUID,
    name: "Sauce edition test",
    tagline: "Accroche edition",
    description: "Description",
    characteristic: "Epicée",
    image_url: null,
    is_available: true,
    category: { id: "cat-1", name: "Catégorie test" },
    stock: { id: "stock-1", quantity: 12 },
    conditionings: [{ id: "cond-1", volume: "250ml", price: "3.90" }],
    ingredients: [{ id: "ing-1", name: "Poivre", quantity: "2g" }],
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

function renderEditPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/dashboard/sauces/:id/edit" element={<EditSaucePage />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function setupLoadedPage(
  user: ReturnType<typeof userEvent.setup>,
  sauce: SauceApiSerialized = apiSauce(),
) {
  fetchSauceMock.mockResolvedValue({ sauce });
  renderEditPage(`/dashboard/sauces/${EDIT_UUID}/edit`);
  await screen.findByDisplayValue("Sauce edition test");
  return { user };
}

function mockSuccessfulGlobalSave() {
  updateSauceMock.mockResolvedValue({ message: "Sauce mise à jour.", sauce: apiSauce() });
  updateSauceConditioningMock.mockResolvedValue({ message: "ok" });
  updateSauceIngredientMock.mockResolvedValue({ message: "ok" });
}

function deferredPromise<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("EditSaucePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.categoriesState.error = null;
    hoisted.categoriesState.categoriesBlocked = false;
  });

  it("shows loading then renders the form and list sections for a valid id", async () => {
    fetchSauceMock.mockResolvedValue({ sauce: apiSauce() });

    renderEditPage(`/dashboard/sauces/${EDIT_UUID}/edit`);

    expect(screen.getByText(/Chargement de la sauce/i)).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Sauce edition test")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Fiche sauce/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Conditionnements/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Ingrédients/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enregistrer la sauce/i })).toBeInTheDocument();
  });

  it("saves the entire sauce when the user clicks Enregistrer la sauce", async () => {
    const user = userEvent.setup();
    mockSuccessfulGlobalSave();

    await setupLoadedPage(user);
    const nameInput = screen.getByRole("textbox", { name: "Nom" });
    await user.clear(nameInput);
    await user.type(nameInput, "Nom mis à jour");

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(updateSauceMock).toHaveBeenCalledTimes(1);
    });
    expect((updateSauceMock.mock.calls[0]![1] as FormData).get("name")).toBe("Nom mis à jour");
    await waitFor(() => {
      expect(updateSauceConditioningMock).toHaveBeenCalledWith(EDIT_UUID, "cond-1", { volume: "250ml", price: "3.90" });
    });
    await waitFor(() => {
      expect(updateSauceIngredientMock).toHaveBeenCalledWith(EDIT_UUID, "ing-1", { name: "Poivre", quantity: "2g" });
    });
    expect(showSuccess).toHaveBeenCalledWith("Sauce mise à jour.");
    expect(hoisted.navigate).toHaveBeenCalledWith(`/sauce/${EDIT_UUID}`, { replace: true });
    expect(fetchSauceMock).toHaveBeenCalledTimes(1);
  });

  it("creates new conditioning and ingredient rows on full save", async () => {
    const user = userEvent.setup();
    mockSuccessfulGlobalSave();
    createSauceConditioningMock.mockResolvedValue({
      message: "Conditionnement créé.",
      conditioning: { id: "cond-new", volume: "1L", price: "10.00" },
    });
    createSauceIngredientMock.mockResolvedValue({
      message: "Ingrédient créé.",
      ingredient: { id: "ing-new", name: "Miel", quantity: "5g" },
    });

    await setupLoadedPage(user);

    await user.click(screen.getByRole("button", { name: /Ajouter un conditionnement/i }));
    const volumeInputs = screen.getAllByLabelText(/Volume #/i);
    const priceInputs = screen.getAllByLabelText(/Prix #/i);
    await user.clear(volumeInputs[1]!);
    await user.type(volumeInputs[1]!, "1L");
    await user.clear(priceInputs[1]!);
    await user.type(priceInputs[1]!, "10");

    await user.click(screen.getByRole("button", { name: /Ajouter un ingrédient/i }));
    const nameInputs = screen.getAllByLabelText(/Nom #/i);
    const qtyInputs = screen.getAllByLabelText(/Quantité #/i);
    await user.clear(nameInputs[1]!);
    await user.type(nameInputs[1]!, "Miel");
    await user.clear(qtyInputs[1]!);
    await user.type(qtyInputs[1]!, "5g");

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(createSauceConditioningMock).toHaveBeenCalledWith(EDIT_UUID, { volume: "1L", price: "10" });
    });
    await waitFor(() => {
      expect(createSauceIngredientMock).toHaveBeenCalledWith(EDIT_UUID, { name: "Miel", quantity: "5g" });
    });
  });

  it("shows version conflict when the first PATCH returns 409", async () => {
    const user = userEvent.setup();
    updateSauceMock.mockRejectedValue(new ApiError("Conflict", 409));
    await setupLoadedPage(user);
    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(updateSauceMock).toHaveBeenCalled();
    });
    expect(showError).not.toHaveBeenCalled();
    expect(await screen.findByText(/Cette fiche a été modifiée ailleurs/i)).toBeInTheDocument();
  });

  it("shows version conflict when a nested update fails with 409 after the main PATCH succeeds", async () => {
    const user = userEvent.setup();
    updateSauceMock.mockResolvedValue({ message: "ok", sauce: apiSauce() });
    updateSauceConditioningMock.mockRejectedValue(new ApiError("Conflict", 409));
    await setupLoadedPage(user);
    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(updateSauceConditioningMock).toHaveBeenCalled();
    });
    expect(showError).not.toHaveBeenCalled();
    expect(await screen.findByText(/Cette fiche a été modifiée ailleurs/i)).toBeInTheDocument();
  });

  it("refetches sauce data when the user clicks reload after a version conflict", async () => {
    const user = userEvent.setup();
    updateSauceMock.mockResolvedValue({ message: "ok", sauce: apiSauce() });
    updateSauceConditioningMock.mockRejectedValueOnce(new ApiError("Conflict", 409)).mockResolvedValueOnce({ message: "ok" });
    await setupLoadedPage(user);
    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await screen.findByText(/Cette fiche a été modifiée ailleurs/i);
    expect(fetchSauceMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /Recharger les données serveur/i }));

    await waitFor(() => {
      expect(fetchSauceMock).toHaveBeenCalledTimes(2);
    });
    expect(screen.queryByText(/Cette fiche a été modifiée ailleurs/i)).not.toBeInTheDocument();
  });

  it("does not call the API when full save fails client-side validation", async () => {
    const user = userEvent.setup();
    await setupLoadedPage(user);

    const volumeInput = await screen.findByLabelText(/Volume #1/i);
    await user.clear(volumeInput);

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    expect(updateSauceMock).not.toHaveBeenCalled();
    expect(showSuccess).not.toHaveBeenCalled();
  });

  it("renders not found state when API returns 404", async () => {
    fetchSauceMock.mockRejectedValue(new ApiError("Not found", 404));

    renderEditPage(`/dashboard/sauces/${EDIT_UUID}/edit`);

    expect(await screen.findByText(/Sauce introuvable/i)).toBeInTheDocument();
  });

  it("renders error state when API returns server error", async () => {
    fetchSauceMock.mockRejectedValue(new ApiError("Service indisponible", 503));

    renderEditPage(`/dashboard/sauces/${EDIT_UUID}/edit`);

    expect(await screen.findByText("Service indisponible")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Réessayer/i })).toBeInTheDocument();
  });

  it("marks a conditioning row for deletion and deletes it on global save", async () => {
    const user = userEvent.setup();
    mockSuccessfulGlobalSave();
    deleteSauceConditioningMock.mockResolvedValue({ message: "deleted" });
    await setupLoadedPage(
      user,
      apiSauce({
        conditionings: [
          { id: "cond-1", volume: "250ml", price: "3.90" },
          { id: "cond-2", volume: "500ml", price: "6.00" },
        ],
      }),
    );

    const deleteButtons = screen.getAllByRole("button", { name: /Supprimer le conditionnement #/i });
    await user.click(deleteButtons[0]!);

    expect(deleteSauceConditioningMock).not.toHaveBeenCalled();
    expect(screen.getAllByLabelText(/Volume #/i)).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(deleteSauceConditioningMock).toHaveBeenCalledWith(EDIT_UUID, "cond-1");
    });
  });

  it("shows an error toast when a deferred conditioning delete fails during global save", async () => {
    const user = userEvent.setup();
    mockSuccessfulGlobalSave();
    const sauceWithTwoConditionings = apiSauce({
      conditionings: [
        { id: "cond-1", volume: "250ml", price: "3.90" },
        { id: "cond-2", volume: "500ml", price: "6.00" },
      ],
    });
    fetchSauceMock.mockResolvedValue({
      sauce: apiSauce({
        conditionings: [
          { id: "cond-1", volume: "250ml", price: "3.90" },
          { id: "cond-2", volume: "500ml", price: "6.00" },
        ],
      }),
    });
    deleteSauceConditioningMock.mockRejectedValue(new ApiError("Refus serveur", 422));
    await setupLoadedPage(user, sauceWithTwoConditionings);

    const deleteButtons = screen.getAllByRole("button", { name: /Supprimer le conditionnement #/i });
    await user.click(deleteButtons[0]!);
    expect(deleteSauceConditioningMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith("Refus serveur");
    });
    expect(screen.getAllByLabelText(/Volume #/i)).toHaveLength(1);
  });

  it("marks an ingredient row for deletion and deletes it on global save", async () => {
    const user = userEvent.setup();
    mockSuccessfulGlobalSave();
    deleteSauceIngredientMock.mockResolvedValue({ message: "deleted" });
    await setupLoadedPage(
      user,
      apiSauce({
        ingredients: [
          { id: "ing-1", name: "Poivre", quantity: "2g" },
          { id: "ing-2", name: "Sel", quantity: "1g" },
        ],
      }),
    );

    const deleteButtons = screen.getAllByRole("button", { name: /Supprimer l'ingrédient #/i });
    await user.click(deleteButtons[0]!);

    expect(deleteSauceIngredientMock).not.toHaveBeenCalled();
    expect(screen.getAllByLabelText(/Nom #/i)).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(deleteSauceIngredientMock).toHaveBeenCalledWith(EDIT_UUID, "ing-1");
    });
  });

  it("shows an error toast when a deferred ingredient delete fails during global save", async () => {
    const user = userEvent.setup();
    mockSuccessfulGlobalSave();
    const sauceWithTwoIngredients = apiSauce({
      ingredients: [
        { id: "ing-1", name: "Poivre", quantity: "2g" },
        { id: "ing-2", name: "Sel", quantity: "1g" },
      ],
    });
    deleteSauceIngredientMock.mockRejectedValue(new ApiError("Refus serveur", 422));
    await setupLoadedPage(user, sauceWithTwoIngredients);

    const deleteButtons = screen.getAllByRole("button", { name: /Supprimer l'ingrédient #/i });
    await user.click(deleteButtons[0]!);
    expect(deleteSauceIngredientMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith("Refus serveur");
    });
    expect(screen.getAllByLabelText(/Nom #/i)).toHaveLength(1);
  });

  it("shows not found when the route id is blank after trimming", async () => {
    renderEditPage("/dashboard/sauces/%20/edit");

    expect(await screen.findByText(/Sauce introuvable/i)).toBeInTheDocument();
    expect(fetchSauceMock).not.toHaveBeenCalled();
  });

  it("refetches sauce when the user clicks retry after a load error", async () => {
    const user = userEvent.setup();
    fetchSauceMock.mockRejectedValueOnce(new ApiError("Service indisponible", 503)).mockResolvedValueOnce({ sauce: apiSauce() });

    renderEditPage(`/dashboard/sauces/${EDIT_UUID}/edit`);

    expect(await screen.findByText("Service indisponible")).toBeInTheDocument();
    expect(fetchSauceMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /Réessayer/i }));

    expect(await screen.findByDisplayValue("Sauce edition test")).toBeInTheDocument();
    await waitFor(() => {
      expect(fetchSauceMock).toHaveBeenCalledTimes(2);
    });
  });

  it("shows an error toast when the main update fails with non-409 error", async () => {
    const user = userEvent.setup();
    updateSauceMock.mockRejectedValue(new ApiError("Validation impossible", 422));
    await setupLoadedPage(user);

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith("Validation impossible");
    });
    expect(screen.queryByText(/Cette fiche a été modifiée ailleurs/i)).not.toBeInTheDocument();
  });

  it("shows an error toast when a nested update fails with non-409 error", async () => {
    const user = userEvent.setup();
    updateSauceMock.mockResolvedValue({ message: "ok", sauce: apiSauce() });
    updateSauceConditioningMock.mockRejectedValue(new ApiError("Erreur conditionnement", 422));
    await setupLoadedPage(user);

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith("Erreur conditionnement");
    });
    expect(screen.queryByText(/Cette fiche a été modifiée ailleurs/i)).not.toBeInTheDocument();
  });

  it("disables global save when categories are blocked", async () => {
    hoisted.categoriesState.categoriesBlocked = true;
    fetchSauceMock.mockResolvedValue({ sauce: apiSauce() });
    renderEditPage(`/dashboard/sauces/${EDIT_UUID}/edit`);

    await screen.findByDisplayValue("Sauce edition test");
    expect(screen.getByRole("button", { name: /Enregistrer la sauce/i })).toBeDisabled();
  });

  it("shows category auth warning when categories endpoint is unavailable", async () => {
    hoisted.categoriesState.error = "error";
    fetchSauceMock.mockResolvedValue({ sauce: apiSauce() });
    renderEditPage(`/dashboard/sauces/${EDIT_UUID}/edit`);

    await screen.findByDisplayValue("Sauce edition test");
    expect(screen.getByText(/Rechargez la page après connexion admin./i)).toBeInTheDocument();
  });

  it("shows loading label while save is in progress", async () => {
    const user = userEvent.setup();
    updateSauceConditioningMock.mockResolvedValue({ message: "ok" });
    updateSauceIngredientMock.mockResolvedValue({ message: "ok" });
    const pendingSave = deferredPromise<{ message: string; sauce: SauceApiSerialized }>();
    updateSauceMock.mockReturnValue(pendingSave.promise);
    await setupLoadedPage(user);

    await user.click(screen.getByRole("button", { name: /Enregistrer la sauce/i }));
    expect(await screen.findByRole("button", { name: /Enregistrement…/i })).toBeDisabled();

    pendingSave.resolve({ message: "ok", sauce: apiSauce() });
    await waitFor(() => {
      expect(hoisted.navigate).toHaveBeenCalledWith(`/sauce/${EDIT_UUID}`, { replace: true });
    });
  });
});
