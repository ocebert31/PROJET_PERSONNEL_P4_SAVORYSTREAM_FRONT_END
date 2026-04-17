import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as authContext from '../../context/authContext';
import { AuthProvider } from '../../context/authContext';
import RouterComponent from '../../routes/routerComponent';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('../../pages/createSaucePage', () => ({
  default: () => <div>Create Sauce Page</div>,
}));

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

describe('Navigation behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('public routes', () => {
    const publicRoutes = [
      { path: '/register', expectedText: /Inscription/i },
      { path: '/login', expectedText: /Connexion/i },
      { path: '/', expectedText: /Nos Sauces Maison 🍶/i },
      { path: '/mentions-legales', expectedText: /Mentions légales/i },
      { path: '/cgv', expectedText: /Conditions Générales de Vente/i },
      { path: '/confidentialite', expectedText: /Politique de confidentialité/i },
      { path: '/cookies', expectedText: /Politique cookies/i },
    ];

    publicRoutes.forEach(({ path, expectedText }) => {
      it(`renders ${path}`, () => {
        renderWithRouter(path);
        expect(screen.getByText(expectedText)).toBeInTheDocument();
      });
    });
  });

  describe('protected admin route', () => {
    it('renders create sauce route for admin users', () => {
      mockUseAuth(mockAdminUser);

      renderWithRouter('/dashboard/sauces/create');

      expect(screen.getByText('Create Sauce Page')).toBeInTheDocument();
    });
    
    it('redirects non-admin users from create route to login', () => {
      mockUseAuth(null);

      renderWithRouter('/dashboard/sauces/create');

      expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
      expect(screen.queryByText('Create Sauce Page')).not.toBeInTheDocument();
    });
  });
});
