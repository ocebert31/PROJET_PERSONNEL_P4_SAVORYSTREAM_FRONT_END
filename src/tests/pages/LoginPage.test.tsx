import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../pages/LoginPage';
import * as authService from '../../services/users/authentication';
import * as authContext from '../../context/AuthContext';
import * as toastHook from '../../hooks/useToast';

vi.mock('../../services/users/authentication', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/users/authentication')>();
  return {
    ...actual,
    postLogin: vi.fn(),
  };
});

const refreshUserMock = vi.fn().mockResolvedValue(undefined);
const showSuccessMock = vi.fn();
const showErrorMock = vi.fn();

const getEmailInput = () => screen.getByLabelText(/Email/i);
const getPhoneInput = () => screen.getByLabelText(/Téléphone/i);
const getPasswordInput = () => screen.getByLabelText('Mot de passe');
const getSubmitButton = () => screen.getByRole('button', { name: /Se connecter/i });

const fillAndSubmitWithEmail = async (email: string, password: string) => {
  await userEvent.type(getEmailInput(), email);
  await userEvent.type(getPasswordInput(), password);
  await userEvent.click(getSubmitButton());
};

const fillAndSubmitWithPhone = async (phone: string, password: string) => {
  await userEvent.type(getPhoneInput(), phone);
  await userEvent.type(getPasswordInput(), password);
  await userEvent.click(getSubmitButton());
};

describe('LoginPage - unit behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      user: null,
      refreshUser: refreshUserMock,
    });
    vi.spyOn(toastHook, 'useToast').mockReturnValue({
      showSuccess: showSuccessMock,
      showError: showErrorMock,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
  });

  test('should render nominal form fields', () => {
    expect(getEmailInput()).toBeInTheDocument();
    expect(getPhoneInput()).toBeInTheDocument();
    expect(getPasswordInput()).toBeInTheDocument();
  });

  test('should submit with email payload in nominal case', async () => {
    const email = `${uuidv4()}@example.com`;
    const password = 'ValidPassword123!';

    vi.mocked(authService.postLogin).mockResolvedValue({
      message: 'Connexion réussie.',
      access_token: 'access',
      access_expires_in: 900,
      refresh_expires_at: new Date().toISOString(),
      remember_me: false,
      user: {
        id: uuidv4(),
        first_name: 'Jane',
        last_name: 'Doe',
        email: email.trim(),
        phone_number: null,
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    await fillAndSubmitWithEmail(email, password);

    await waitFor(() => {
      expect(authService.postLogin).toHaveBeenCalledWith({
        email,
        password,
      });
      expect(refreshUserMock).toHaveBeenCalledTimes(1);
      expect(showSuccessMock).toHaveBeenCalled();
    });
  });

  test('should submit with phone payload when email is empty', async () => {
    const phone = '0612345678';
    const password = 'ValidPassword123!';
    vi.mocked(authService.postLogin).mockResolvedValue({
      message: 'Connexion réussie.',
      access_token: 'access',
      access_expires_in: 900,
      refresh_expires_at: new Date().toISOString(),
      remember_me: false,
      user: {
        id: uuidv4(),
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        phone_number: phone.trim(),
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    await fillAndSubmitWithPhone(phone, password);

    await waitFor(() => {
      expect(authService.postLogin).toHaveBeenCalledWith({
        phoneNumber: phone,
        password,
      });
    });
  });

  test('should not submit when data is invalid', async () => {
    await fillAndSubmitWithEmail('invalid-email', 'ValidPassword123!');

    await waitFor(() => {
      expect(authService.postLogin).not.toHaveBeenCalled();
      expect(screen.getByText(/L'email est invalide/i)).toBeInTheDocument();
    });
  });

  test('should show error toast when login fails', async () => {
    vi.mocked(authService.postLogin).mockRejectedValue(new Error('Bad credentials'));

    await fillAndSubmitWithEmail('john@example.com', 'ValidPassword123!');

    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith('Bad credentials');
    });
  });
});
