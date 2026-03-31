import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';
import * as sessionService from '../../services/sessionService';
import { vi, describe, beforeEach, test, expect, type Mock } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';

vi.mock('../../services/sessionService', () => ({
    loginAndStore: vi.fn(),
}));

const getEmailInput = () => screen.getByLabelText(/Email/i);
const getPasswordInput = () => screen.getByLabelText('Mot de passe');
const getSubmitButton = () => screen.getByRole('button', { name: /Se connecter/i });

const fillAndSubmitForm = async (email: string, password: string) => {
    await userEvent.type(getEmailInput(), email);
    await userEvent.type(getPasswordInput(), password);
    await userEvent.click(getSubmitButton());
};

describe('LoginPage - Form behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
    });

    test('should initialize form fields correctly', () => {
        expect(getEmailInput()).toBeInTheDocument();
        expect(getPasswordInput()).toBeInTheDocument();
    }); 

    test('should call postLogin with valid data on form submission', async () => {
        const email = `${uuidv4()}@example.com`;
        const password = 'ValidPassword123!';

        (sessionService.loginAndStore as Mock).mockResolvedValue({
            message: 'Connexion réussie.',
            access_token: 'access',
            access_expires_in: 900,
            refresh_expires_at: new Date().toISOString(),
            remember_me: false,
            user: {
                id: uuidv4(),
                first_name: 'Jane',
                last_name: 'Doe',
                email,
                phone_number: null,
                role: 'customer',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        });

        await fillAndSubmitForm(email, password);

        await waitFor(() =>
            expect(sessionService.loginAndStore).toHaveBeenCalledWith({ email, password })
        );
    });

    test('should not submit form with invalid data', async () => {
        const email = 'invalid-email';
        const password = 'ValidPassword123!';
        await fillAndSubmitForm(email, password);
        await waitFor(() => {
            expect(sessionService.loginAndStore).not.toHaveBeenCalled();
            expect(screen.getByText(/L'email est invalide/i)).toBeInTheDocument();
        });
    });

    test('should reset form fields after successful submission', async () => {
        const email = `${uuidv4()}@example.com`;
        const password = 'ValidPassword123!';
        const emailInput = getEmailInput() as HTMLInputElement;
        const passwordInput = getPasswordInput() as HTMLInputElement; 
        (sessionService.loginAndStore as Mock).mockResolvedValue({
            message: 'Connexion réussie.',
            access_token: 'access',
            access_expires_in: 900,
            refresh_expires_at: new Date().toISOString(),
            remember_me: false,
            user: {
                id: uuidv4(),
                first_name: 'Jane',
                last_name: 'Doe',
                email,
                phone_number: null,
                role: 'customer',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        });
        await fillAndSubmitForm(email, password);
        await waitFor(() => expect(sessionService.loginAndStore).toHaveBeenCalledWith({ email, password }));
        await waitFor(() => {
            expect(emailInput.value).toBe('');
            expect(passwordInput.value).toBe('');
        });
    });
});
