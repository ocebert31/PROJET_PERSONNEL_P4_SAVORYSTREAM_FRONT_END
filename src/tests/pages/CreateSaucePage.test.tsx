import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import type { BaseSyntheticEvent } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateSaucePage from "../../pages/CreateSaucePage";
import type { SauceCreateFormValues } from "../../schemas/sauceCreateSchema";
import { sauceCreateDefaultValues } from "../../schemas/sauceCreateSchema";
import type { SauceCreateResponse } from "../../types/Sauce";
import { ApiError } from "../../services/apiRequest/apiError";
import * as sauceService from "../../services/sauces/sauceService";
import { buildSauceCreatePayload } from "../../mappers/buildSauceCreatePayload";

const hoisted = vi.hoisted(() => ({
  navigate: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
  useCreateSauceForm: vi.fn(),
  useGetSauceCategories: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => hoisted.navigate,
  };
});

vi.mock("../../hooks/useToast", () => ({
  useToast: () => ({
    showSuccess: hoisted.showSuccess,
    showError: hoisted.showError,
  }),
}));

vi.mock("../../hooks/useCreateSauceForm", () => ({
  useCreateSauceForm: hoisted.useCreateSauceForm,
}));

vi.mock("../../hooks/useGetSauceCategories", () => ({
  useGetSauceCategories: hoisted.useGetSauceCategories,
}));

vi.mock("../../services/sauces/sauceService", () => ({
  createSauce: vi.fn(),
}));

vi.mock("../../mappers/buildSauceCreatePayload", () => ({
  buildSauceCreatePayload: vi.fn(),
}));

vi.mock("../../components/Dashboard/Sauce/SauceIdentityFields", () => ({
  SauceIdentityFields: () => <div data-testid="sauce-identity" />,
}));

vi.mock("../../components/Dashboard/Sauce/FormSection", () => ({
  FormSection: ({ title, children }: { title: string; children?: ReactNode }) => (
    <div data-testid={`section-${title}`}>{children}</div>
  ),
}));

vi.mock("../../common/Fields/InputFieldForm", () => ({
  default: ({ additionalContent }: { additionalContent?: ReactNode }) => (
    <div data-testid="input-field-stub">{additionalContent ?? null}</div>
  ),
}));

const validValues: SauceCreateFormValues = {
  ...sauceCreateDefaultValues,
  name: "Sauce test",
  tagline: "Accroche",
  description: "Description",
  characteristic: "Caractère",
  category_id: "cat-1",
};

function makeHandleSubmit(values: SauceCreateFormValues) {
  return vi.fn((callback: (v: SauceCreateFormValues) => Promise<void>) => {
    return async (event: BaseSyntheticEvent) => {
      event.preventDefault();
      await callback(values);
    };
  });
}

function minimalSauceResponse(overrides: Partial<SauceCreateResponse["sauce"]> = {}): SauceCreateResponse {
  return {
    message: " Créée ",
    sauce: {
      id: "new-sauce-id",
      name: "Sauce test",
      tagline: "Accroche",
      description: "Description",
      characteristic: "Caractère",
      image_url: null,
      is_available: true,
      category: null,
      stock: null,
      conditionings: [],
      ingredients: [],
      created_at: "",
      updated_at: "",
      ...overrides,
    },
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <CreateSaucePage />
    </MemoryRouter>,
  );
}

describe("CreateSaucePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.useGetSauceCategories.mockReturnValue({
      error: null,
      selectOptions: [],
      categoriesBlocked: false,
    });
    hoisted.useCreateSauceForm.mockReturnValue({
      register: vi.fn(() => ({})),
      handleSubmit: makeHandleSubmit(validValues),
      formState: { errors: {}, isSubmitting: false },
    });
    vi.mocked(buildSauceCreatePayload).mockReturnValue(new FormData());
    vi.mocked(sauceService.createSauce).mockResolvedValue(minimalSauceResponse());
  });

  describe("nominal case", () => {
    it("submits via buildSauceCreatePayload and createSauce, shows success, then navigates to the new sauce", async () => {
      const user = userEvent.setup();
      const payload = new FormData();
      payload.append("name", "Sauce test");
      vi.mocked(buildSauceCreatePayload).mockReturnValue(payload);

      renderPage();

      await user.click(screen.getByRole("button", { name: /Créer la sauce/i }));

      await waitFor(() => {
        expect(buildSauceCreatePayload).toHaveBeenCalledTimes(1);
        expect(buildSauceCreatePayload).toHaveBeenCalledWith(validValues);
        expect(sauceService.createSauce).toHaveBeenCalledTimes(1);
        expect(sauceService.createSauce).toHaveBeenCalledWith(payload);
        expect(hoisted.showSuccess).toHaveBeenCalledWith("Créée");
        expect(hoisted.navigate).toHaveBeenCalledWith("/sauce/new-sauce-id", { replace: true });
      });
    });
  });

  describe("variations", () => {
    it("uses default success copy when the API message is empty after trim", async () => {
      const user = userEvent.setup();
      vi.mocked(sauceService.createSauce).mockResolvedValue({
        ...minimalSauceResponse(),
        message: "   ",
      });

      renderPage();
      await user.click(screen.getByRole("button", { name: /Créer la sauce/i }));

      await waitFor(() => {
        expect(hoisted.showSuccess).toHaveBeenCalledWith("Sauce créée.");
      });
    });

    it("shows API validation message on 422 ApiError", async () => {
      const user = userEvent.setup();
      vi.mocked(sauceService.createSauce).mockRejectedValue(new ApiError("Champs invalides", 422));

      renderPage();
      await user.click(screen.getByRole("button", { name: /Créer la sauce/i }));

      await waitFor(() => {
        expect(hoisted.showError).toHaveBeenCalledWith("Champs invalides");
      });
      expect(hoisted.navigate).not.toHaveBeenCalled();
    });

    it("shows generic API message on non-422 ApiError", async () => {
      const user = userEvent.setup();
      vi.mocked(sauceService.createSauce).mockRejectedValue(new ApiError("Erreur serveur", 500));

      renderPage();
      await user.click(screen.getByRole("button", { name: /Créer la sauce/i }));

      await waitFor(() => {
        expect(hoisted.showError).toHaveBeenCalledWith("Erreur serveur");
      });
    });

    it("shows fallback copy when the error is not an Error instance", async () => {
      const user = userEvent.setup();
      vi.mocked(sauceService.createSauce).mockRejectedValue("unexpected");

      renderPage();
      await user.click(screen.getByRole("button", { name: /Créer la sauce/i }));

      await waitFor(() => {
        expect(hoisted.showError).toHaveBeenCalledWith("Création impossible.");
      });
    });

    it("disables submit and shows persistence hint when categories failed to load", () => {
      hoisted.useGetSauceCategories.mockReturnValue({
        error: "Échec chargement",
        selectOptions: [],
        categoriesBlocked: true,
      });

      renderPage();

      expect(screen.getByRole("button", { name: /Créer la sauce/i })).toBeDisabled();
      expect(screen.getByText(/Rechargez la page après connexion admin/i)).toBeInTheDocument();
    });

    it("disables submit while categories are still loading", () => {
      hoisted.useGetSauceCategories.mockReturnValue({
        error: null,
        selectOptions: [],
        categoriesBlocked: true,
      });

      renderPage();

      expect(screen.getByRole("button", { name: /Créer la sauce/i })).toBeDisabled();
    });

    it("shows saving label and disables submit while isSubmitting", () => {
      hoisted.useCreateSauceForm.mockReturnValue({
        register: vi.fn(() => ({})),
        handleSubmit: makeHandleSubmit(validValues),
        formState: { errors: {}, isSubmitting: true },
      });

      renderPage();

      expect(screen.getByRole("button", { name: /Enregistrement/i })).toBeDisabled();
    });

    it("navigates back when Annuler is clicked", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(screen.getByRole("button", { name: /Annuler/i }));

      expect(hoisted.navigate).toHaveBeenCalledWith(-1);
    });
  });
});
