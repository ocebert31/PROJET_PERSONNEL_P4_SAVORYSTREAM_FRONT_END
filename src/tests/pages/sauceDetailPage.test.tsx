import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SauceDetail from "../../pages/sauceDetailPage";
import { ApiError } from "../../services/apiRequest/apiError";
import type { SauceApiSerialized } from "../../types/sauce";
import { fetchSauce } from "../../services/sauces/sauceService";
import { useAuth } from "../../context/authContext";

vi.mock("../../services/sauces/sauceService", () => ({
  fetchSauce: vi.fn(),
  fetchSauces: vi.fn(),
  createSauce: vi.fn(),
}));

vi.mock("../../context/authContext", () => ({
  useAuth: vi.fn(),
}));

const fetchSauceMock = vi.mocked(fetchSauce);
const useAuthMock = vi.mocked(useAuth);

const DETAIL_UUID = "aaaaaaaa-bbbb-cccc-dddd-111111111111";

function detailApiSauce(): SauceApiSerialized {
  return {
    id: DETAIL_UUID,
    name: "Sauce Barbecue Test",
    tagline: "Accroche test",
    description: "Description détaillée pour les tests.",
    characteristic: "Goût fumé",
    image_url: "/assets/test-bbq.jpg",
    is_available: true,
    category: null,
    stock: null,
    conditionings: [
      { id: "c1", volume: "250ml", price: "3.99" },
      { id: "c2", volume: "500ml", price: "6.49" },
    ],
    ingredients: [
      { id: "i1", name: "Tomate", quantity: "200g" },
      { id: "i2", name: "Paprika", quantity: "5g" },
    ],
    created_at: "",
    updated_at: "",
  };
}

function renderSauceDetail(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/sauce/:id" element={<SauceDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("SauceDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthMock.mockReturnValue({
      user: null,
      refreshUser: vi.fn(),
    });
    fetchSauceMock.mockImplementation(async (id: string) => {
      if (id === DETAIL_UUID) {
        return { sauce: detailApiSauce() };
      }
      throw new ApiError("Not found", 404);
    });
  });

  it("shows loading then product detail for a valid id", async () => {
    renderSauceDetail(`/sauce/${DETAIL_UUID}`);

    expect(screen.getByText(/Chargement de la sauce/i)).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Sauce Barbecue Test" })
    ).toBeInTheDocument();
    expect(screen.getByText("Description détaillée pour les tests.")).toBeInTheDocument();
    expect(screen.getByText("Choisis ton format")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(screen.getAllByText("Sauce Barbecue Test").length).toBeGreaterThanOrEqual(2);
    const img = screen.getByRole("img", { name: "Sauce Barbecue Test" });
    expect(img).toHaveAttribute("src", "/assets/test-bbq.jpg");
    expect(screen.getByRole("button", { name: /250ml/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /500ml/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Modifier cette sauce/i })).not.toBeInTheDocument();
  });

  it("shows edit link for admin users", async () => {
    useAuthMock.mockReturnValue({
      user: {
        id: "admin-id",
        first_name: "Admin",
        last_name: "User",
        email: "admin@test.com",
        phone_number: null,
        role: "admin",
        created_at: "",
        updated_at: "",
      },
      refreshUser: vi.fn(),
    });
    renderSauceDetail(`/sauce/${DETAIL_UUID}`);

    const editLink = await screen.findByRole("link", { name: /Modifier cette sauce/i });
    expect(editLink).toHaveAttribute("href", `/dashboard/sauces/${DETAIL_UUID}/edit`);
  });

  it("renders characteristic and ingredients tabs", async () => {
    renderSauceDetail(`/sauce/${DETAIL_UUID}`);
    expect(await screen.findByText("Goût fumé")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ingrédients/i })).toBeInTheDocument();
  });

  it("switches to the Ingredients tab", async () => {
    renderSauceDetail(`/sauce/${DETAIL_UUID}`);
    await userEvent.click(await screen.findByRole("button", { name: /Ingrédients/i }));
    expect(screen.getByText("Tomate")).toBeInTheDocument();
    expect(screen.getByText("200g")).toBeInTheDocument();
  });

  it("renders not found state for an unknown id", async () => {
    renderSauceDetail("/sauce/99999999-9999-9999-9999-999999999999");
    expect(await screen.findByText("Sauce introuvable")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1, name: "Sauce Barbecue Test" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Réessayer" })).not.toBeInTheDocument();
    expect(fetchSauceMock).toHaveBeenCalledTimes(1);
  });

  it("renders error and retry on non-404 failure", async () => {
    fetchSauceMock.mockRejectedValueOnce(new ApiError("Service unavailable", 503));
    renderSauceDetail(`/sauce/${DETAIL_UUID}`);

    expect(await screen.findByText("Service unavailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Réessayer" })).toBeInTheDocument();
  });

  it("keeps loading state visible while request is pending", () => {
    fetchSauceMock.mockImplementationOnce(
      () =>
        new Promise(() => {
        })
    );
    renderSauceDetail(`/sauce/${DETAIL_UUID}`);
    expect(screen.getByRole("status")).toHaveTextContent("Chargement de la sauce…");
    expect(screen.queryByRole("heading", { level: 1, name: "Sauce Barbecue Test" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Réessayer" })).not.toBeInTheDocument();
  });

  it("retries and renders detail after a recoverable error", async () => {
    fetchSauceMock
      .mockRejectedValueOnce(new ApiError("Service unavailable", 503))
      .mockResolvedValueOnce({ sauce: detailApiSauce() });

    renderSauceDetail(`/sauce/${DETAIL_UUID}`);

    expect(await screen.findByText("Service unavailable")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Réessayer" }));

    await waitFor(() => expect(fetchSauceMock).toHaveBeenCalledTimes(2));
    expect(
      await screen.findByRole("heading", { level: 1, name: "Sauce Barbecue Test" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Service unavailable")).not.toBeInTheDocument();
  });

  it("does not show edit link for non-admin users", async () => {
    useAuthMock.mockReturnValue({
      user: {
        id: "customer-id",
        first_name: "Client",
        last_name: "User",
        email: "client@test.com",
        phone_number: null,
        role: "customer",
        created_at: "",
        updated_at: "",
      },
      refreshUser: vi.fn(),
    });
    renderSauceDetail(`/sauce/${DETAIL_UUID}`);

    await screen.findByRole("heading", { level: 1, name: "Sauce Barbecue Test" });
    expect(screen.queryByRole("link", { name: /Modifier cette sauce/i })).not.toBeInTheDocument();
  });
});
