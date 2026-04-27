import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as authContext from '../../context/authContext';
import { AuthProvider } from '../../context/authContext';
import RouterComponent from '../../routes/routerComponent';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import type { SauceApiSerialized } from '../../types/sauce';

vi.mock('../../pages/dashboard/sauce/createSaucePage', () => ({
  default: () => <div>Create Sauce Page</div>,
}));

vi.mock('../../pages/dashboard/sauce/editSaucePage', () => ({
  default: () => <div>Edit Sauce Page</div>,
}));

vi.mock('../../pages/dashboard/category/dashboardCategoriesPage', () => ({
  default: () => <div>Dashboard Categories Page</div>,
}));

vi.mock('../../services/sauces/sauceService', () => ({
  fetchSauces: vi.fn(),
  fetchSauce: vi.fn(),
  createSauce: vi.fn(),
}));

import { fetchSauces } from '../../services/sauces/sauceService';

const mockedFetchSauces = vi.mocked(fetchSauces);

const stubCatalogueSauce: SauceApiSerialized = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Stub sauce',
  tagline: 'stub',
  description: null,
  characteristic: null,
  image_url: null,
  is_available: true,
  category: null,
  stock: null,
  conditionings: [{ id: 'c1', volume: '250ml', price: '3.99' }],
  ingredients: [],
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

const renderWithRouter = (initialRoute: string) => {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <RouterComponent />
      </AuthProvider>
    </MemoryRouter>
  );
};

const mockAdminUser = {
  id: '1',
  first_name: 'Admin',
  last_name: 'User',
  email: 'admin@example.com',
  phone_number: null,
  role: 'admin' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockUseAuth = (user: typeof mockAdminUser | null) => {
  vi.spyOn(authContext, 'useAuth').mockReturnValue({
    user,
    refreshUser: vi.fn(),
  });
};
describe("Navigation behavior", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("public routes", () => {
    beforeEach(() => {
      mockedFetchSauces.mockResolvedValue({ sauces: [stubCatalogueSauce] });
    });

    it.each([
      { path: "/register", expectedText: /Inscription/i },
      { path: "/login", expectedText: /Connexion/i },
      { path: "/", expectedText: /Nos Sauces Maison 🍶/i },
      { path: "/mentions-legales", expectedText: /Mentions légales/i },
      { path: "/cgv", expectedText: /Conditions Générales de Vente/i },
      { path: "/confidentialite", expectedText: /Politique de confidentialité/i },
      { path: "/cookies", expectedText: /Politique cookies/i },
    ])("renders $path", async ({ path, expectedText }) => {
      renderWithRouter(path);
      expect(await screen.findByText(expectedText)).toBeInTheDocument();
    });
  });

  describe("protected admin route", () => {
    it.each([
      {
        label: "create route for admin",
        user: mockAdminUser,
        path: "/dashboard/sauces/create",
        allowedText: "Create Sauce Page",
      },
      {
        label: "edit route for admin",
        user: mockAdminUser,
        path: "/dashboard/sauces/11111111-1111-1111-1111-111111111111/edit",
        allowedText: "Edit Sauce Page",
      },
      {
        label: "categories route for admin",
        user: mockAdminUser,
        path: "/dashboard/categories",
        allowedText: "Dashboard Categories Page",
      },
    ])("renders $label", ({ user, path, allowedText }) => {
      mockUseAuth(user);
      renderWithRouter(path);
      expect(screen.getByText(allowedText)).toBeInTheDocument();
    });

    it("redirects /dashboard to sauces list for admin", async () => {
      mockUseAuth(mockAdminUser);
      renderWithRouter("/dashboard");
      expect(await screen.findByRole("heading", { name: "Sauces" })).toBeInTheDocument();
    });

    it.each([
      {
        label: "create route for non-admin",
        path: "/dashboard/sauces/create",
        blockedText: "Create Sauce Page",
      },
      {
        label: "edit route for non-admin",
        path: "/dashboard/sauces/11111111-1111-1111-1111-111111111111/edit",
        blockedText: "Edit Sauce Page",
      },
      {
        label: "categories route for non-admin",
        path: "/dashboard/categories",
        blockedText: "Dashboard Categories Page",
      },
    ])("redirects $label to login", ({ path, blockedText }) => {
      mockUseAuth(null);
      renderWithRouter(path);
      expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
      expect(screen.queryByText(blockedText)).not.toBeInTheDocument();
    });
  });
});
