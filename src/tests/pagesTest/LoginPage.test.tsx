import { render, screen, waitFor } from '@testing-library/react';
import LoginPage from '../../pages/LoginPage';
import * as postLogin from '../../services/authenticationService';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';

vi.mock('../../services/authenticationService', () => ({
    postLogin: vi.fn(),
}));

const getEmailInput = () => screen.getByLabelText(/Nom/i);
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
        render(<LoginPage />);
    });

    test('should initialize form fields correctly', () => {
        expect(getEmailInput()).toBeInTheDocument();
        expect(getPasswordInput()).toBeInTheDocument();
    });

    test('should call postLogin with valid data on form submission', async () => {
        const email = `${uuidv4()}@example.com`;
        const password = 'ValidPassword123!';
        await fillAndSubmitForm(email, password);
        await waitFor(() => expect(postLogin.postLogin).toHaveBeenCalledWith({ email, password }));
    });

    test('should not submit form with invalid data', async () => {
        const email = 'invalid-email';
        const password = 'ValidPassword123!';
        await fillAndSubmitForm(email, password);
        await waitFor(() => {
            expect(postLogin.postLogin).not.toHaveBeenCalled();
            expect(screen.getByText(/L'email est invalide/i)).toBeInTheDocument();
        });
    });

    test('should reset form fields after successful submission', async () => {
        const email = `${uuidv4()}@example.com`;
        const password = 'ValidPassword123!';
        const emailInput = getEmailInput() as HTMLInputElement;
        const passwordInput = getPasswordInput() as HTMLInputElement; 
        await fillAndSubmitForm(email, password);
        await waitFor(() => expect(postLogin.postLogin).toHaveBeenCalledWith({ email, password }));
        await waitFor(() => {
            expect(emailInput.value).toBe('');
            expect(passwordInput.value).toBe('');
        });
    });
});
