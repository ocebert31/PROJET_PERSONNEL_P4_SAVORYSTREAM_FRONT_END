import { render, screen } from '@testing-library/react';
import PasswordField from '../../common/Users/PasswordInput';
import { vi, describe, expect, it } from 'vitest';

describe('PasswordField Component', () => {
  const mockRegister = vi.fn();

  const renderPasswordField = (props = {}) => {
    render(
      <PasswordField
        label="Mot de passe"
        name="password"
        register={mockRegister}
        error=""
        htmlFor="password-input"
        id="password-input"
        {...props}
      />
    );
  };

  it('should render the label and associate it with the input', () => {
    renderPasswordField();
    const labelText = screen.getByText('Mot de passe');
    expect(labelText).toBeInTheDocument();

    const input = screen.getByLabelText('Mot de passe');
    expect(input).toBeInTheDocument();
    expect(input.id).toBe('password-input');
  });

  it('should call register with the correct name', () => {
    renderPasswordField();
    expect(mockRegister).toHaveBeenCalledWith('password');
  });

  it('should display an error message when error prop is provided', () => {
    const errorMessage = 'Le mot de passe est requis';
    renderPasswordField({ error: errorMessage });

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it('should not display an error message when error prop is empty', () => {
    renderPasswordField();
    const errorElement = screen.queryByText('Le mot de passe est requis');
    expect(errorElement).not.toBeInTheDocument();
  });
});
