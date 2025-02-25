import { render, screen } from '@testing-library/react';
import EmailInput from '../../common/Users/Emailinput';
import { vi, describe, expect, it, beforeEach } from 'vitest';

describe('InputField Component', () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    mockRegister.mockClear();
  });
  
  const renderEmailInput = (props = {}) => {
    render(
      <EmailInput
        label="TestLabel"
        name="email"
        register={mockRegister}
        error=""
        id="email-input"
        htmlFor="email-input"
        {...props} 
      />
    );
  };

  it('should render the label with the correct text and associate it with the input', () => {
    renderEmailInput();
    const labelText = screen.getByText('TestLabel');
    expect(labelText).toBeInTheDocument();

    const input = screen.getByLabelText('TestLabel');
    expect(input).toBeInTheDocument();
    expect(input.id).toBe('email-input');
  });

  it('should call register with the correct name', () => {
    renderEmailInput();
    expect(mockRegister).toHaveBeenCalledWith('email');
  });

  it('should display an error message when error prop is provided', () => {
    const errorMessage = "L'email est requis";
    renderEmailInput({ error: errorMessage });

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it('should not display an error message if error is empty', () => {
    renderEmailInput();
    const errorElement = screen.queryByText(/L'email est requis/i);
    expect(errorElement).not.toBeInTheDocument();
  });
});
