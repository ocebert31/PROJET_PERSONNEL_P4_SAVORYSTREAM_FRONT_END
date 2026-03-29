import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../../pages/RegisterPage';
import * as postRegister from '../../services/authenticationService';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';

vi.mock('../../services/authenticationService', () => ({
    postRegister: vi.fn(),
}));

const getFormElements = () => ({
    firstNameInput: screen.getByLabelText(/Prénom/i) as HTMLInputElement,
    lastNameInput: screen.getByLabelText(/^Nom$/i) as HTMLInputElement,
    emailInput: screen.getByLabelText(/Email/i) as HTMLInputElement,
    phoneInput: screen.getByLabelText(/Téléphone/i) as HTMLInputElement,
    passwordInput: screen.getByLabelText('Mot de passe') as HTMLInputElement,
    confirmPasswordInput: screen.getByLabelText('Confirmer le mot de passe') as HTMLInputElement,
    submitButton: screen.getByRole('button', { name: /S'inscrire/i })
});

const fillAndSubmitForm = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string,
) => {
    const { firstNameInput, lastNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput, submitButton } = getFormElements();
    await userEvent.type(firstNameInput, firstName);
    await userEvent.type(lastNameInput, lastName);
    await userEvent.type(emailInput, email);
    await userEvent.type(phoneInput, phoneNumber);
    await userEvent.type(passwordInput, password);
    await userEvent.type(confirmPasswordInput, confirmPassword);
    await userEvent.click(submitButton);
};

const checkErrorMessage = (message: RegExp) => {
    expect(screen.getByText(message)).toBeInTheDocument();
};

describe('RegisterPage - Form behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );
    });

    test('should initialize form fields correctly', () => {
        const { firstNameInput, lastNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput } = getFormElements();
        expect(firstNameInput).toBeInTheDocument();
        expect(lastNameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(phoneInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
    });

    test('should call postRegister with valid data on form submission', async () => {
        const email = `${uuidv4()}@example.com`;
        const password = 'ValidPassword123!';
        await fillAndSubmitForm('Jane', 'Doe', email, '0612345678', password, password);
        await waitFor(() =>
            expect(postRegister.postRegister).toHaveBeenCalledWith({
                firstName: 'Jane',
                lastName: 'Doe',
                email,
                phoneNumber: '0612345678',
                password,
                confirmPassword: password,
            }),
        );
    });

    test('should not submit form with invalid data', async () => {
        await userEvent.type(getFormElements().emailInput, 'invalid-email');
        await userEvent.click(getFormElements().submitButton);
        await waitFor(() => {
            expect(postRegister.postRegister).not.toHaveBeenCalled();
            checkErrorMessage(/L'email est invalide/i);
        });
    });

    test('should not submit if password and confirmation do not match', async () => {
        const email = 'test@example.com';
        const password = 'Password123!';
        const confirmPassword = 'DifferentPassword123!';
        await fillAndSubmitForm('Jane', 'Doe', email, '0612345678', password, confirmPassword);
        await waitFor(() => {
            expect(postRegister.postRegister).not.toHaveBeenCalled();
            checkErrorMessage(/Les mots de passe doivent correspondre/i);
        });
    });

    test('should reset form fields after successful submission', async () => {
        const email = `${uuidv4()}@example.com`;
        const password = 'ValidPassword123!';
        await fillAndSubmitForm('Jane', 'Doe', email, '0612345678', password, password);
        const { firstNameInput, lastNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput } = getFormElements();
        await waitFor(() =>
            expect(postRegister.postRegister).toHaveBeenCalledWith({
                firstName: 'Jane',
                lastName: 'Doe',
                email,
                phoneNumber: '0612345678',
                password,
                confirmPassword: password,
            }),
        );
        await waitFor(() => {
            expect(firstNameInput.value).toBe('');
            expect(lastNameInput.value).toBe('');
            expect(emailInput.value).toBe('');
            expect(phoneInput.value).toBe('');
            expect(passwordInput.value).toBe('');
            expect(confirmPasswordInput.value).toBe('');
        });
    });
});
