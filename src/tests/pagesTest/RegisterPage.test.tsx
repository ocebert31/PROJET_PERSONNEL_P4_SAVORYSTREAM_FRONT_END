import { render, screen, waitFor } from '@testing-library/react';
import RegisterPage from '../../pages/RegisterPage';
import * as postRegister from '../../services/authenticationService';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';

vi.mock('../../services/authenticationService', () => ({
    postRegister: vi.fn(),
}));

const getEmailInput = () => screen.getByLabelText(/Nom/i);
const getPasswordInput = () => screen.getByLabelText('Mot de passe');
const getConfirmPasswordInput = () => screen.getByLabelText('Confirmer le mot de passe');
const getSubmitButton = () => screen.getByRole('button', { name: /S'inscrire/i });

describe('RegisterPage - Form behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        render(<RegisterPage />);
    });

    test('should initialize form fields correctly', () => {
        expect(getEmailInput()).toBeInTheDocument();
        expect(getPasswordInput()).toBeInTheDocument();
        expect(getConfirmPasswordInput()).toBeInTheDocument();
    });

    test('should call postRegister with valid data on form submission', async () => {
        const email = `${uuidv4()}@example.com`;
        const password = 'ValidPassword123!';
        await userEvent.type(getEmailInput(), email);
        await userEvent.type(getPasswordInput(), password);
        await userEvent.type(getConfirmPasswordInput(), password);
        await userEvent.click(getSubmitButton());
        await waitFor(() => expect(postRegister.postRegister).toHaveBeenCalledWith({ email, password, confirmPassword: password }));
    });

    test('should not submit form with invalid data', async () => {
        await userEvent.type(getEmailInput(), 'invalid-email');
        await userEvent.click(getSubmitButton());
        await waitFor(() => {
            expect(postRegister.postRegister).not.toHaveBeenCalled();
            expect(screen.getByText(/L'email est invalide/i)).toBeInTheDocument();
        });
    });

    test('should not submit if password and confirmation do not match', async () => {
        await userEvent.type(getEmailInput(), 'test@example.com');
        await userEvent.type(getPasswordInput(), 'Password123!');
        await userEvent.type(getConfirmPasswordInput(), 'DifferentPassword123!');
        await userEvent.click(getSubmitButton());
        await waitFor(() => {
            expect(postRegister.postRegister).not.toHaveBeenCalled();
            expect(screen.getByText(/Les mots de passe doivent correspondre/i)).toBeInTheDocument();
        });
    });
});