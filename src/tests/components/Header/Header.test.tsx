import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Header from '../../../components/Header/Header';
import * as authContext from '../../../context/authContext';

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

const renderHeader = () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header component', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders public navigation links with correct href for non-admin users', () => {
        vi.spyOn(authContext, 'useAuth').mockReturnValue({
            user: null,
            refreshUser: vi.fn(),
            logout: vi.fn(),
        });

        renderHeader();

        const publicLinkLabels = ['Accueil', 'Inscription', 'Connexion'];
        publicLinkLabels.forEach((link) => {
            expect(screen.getByText(link)).toBeInTheDocument();
        });

        const publicLinks = [
            { text: 'Accueil', href: '/' },
        ];

        publicLinks.forEach(({ text, href }) => {
            expect(screen.getByText(text).closest('a')).toHaveAttribute('href', href);
        });
        expect(screen.getByRole("button", { name: "Inscription" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Connexion" })).toBeInTheDocument();

        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('renders admin navigation links with correct href values', () => {
        vi.spyOn(authContext, 'useAuth').mockReturnValue({
            user: {
                id: '1',
                first_name: 'Admin',
                last_name: 'User',
                email: 'admin@example.com',
                phone_number: null,
                role: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            refreshUser: vi.fn(),
            logout: vi.fn().mockResolvedValue(undefined),
        });

        renderHeader();

        const adminLinks = [
            { text: 'Accueil', href: '/' },
            { text: 'Dashboard', href: '/dashboard' },
        ];

        adminLinks.forEach(({ text, href }) => {
            expect(screen.getByText(text)).toBeInTheDocument();
            expect(screen.getByText(text).closest('a')).toHaveAttribute('href', href);
        });
        expect(screen.queryByText('Inscription')).not.toBeInTheDocument();
        expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Déconnexion" })).toBeInTheDocument();
    });
});
