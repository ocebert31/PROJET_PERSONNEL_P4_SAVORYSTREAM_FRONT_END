import { render, screen } from '@testing-library/react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import InputField from '../../common/InputFieldForm';
import type { InputFieldProps, RegisterFormData } from '../../types/User';
import { vi, describe, expect, it, beforeEach } from 'vitest';

describe('InputField Component', () => {
  const mockRegister = vi.fn();

  const defaultProps: InputFieldProps = {
    label: 'TestLabel',
    name: 'email',
    register: mockRegister as unknown as UseFormRegister<RegisterFormData>,
    errors: undefined,
    id: 'email-input',
    htmlFor: 'email-input',
    type: 'text',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderInputField = (props: Partial<InputFieldProps> = {}) =>
    render(<InputField {...defaultProps} {...props} />);

  it('renders the label and input with correct attributes', () => {
    renderInputField();
    const input = screen.getByLabelText(defaultProps.label);

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', defaultProps.id);
  });

  it('registers input with the correct name', () => {
    renderInputField();
    expect(mockRegister).toHaveBeenCalledWith(defaultProps.name);
  });

  it('shows an error message when provided', () => {
    const errorMessage = "L'email est requis";
    const errors: FieldErrors<RegisterFormData> = {
      email: { type: 'required', message: errorMessage },
    };
    renderInputField({ name: 'email', errors });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('hides the error message when no error is provided', () => {
    renderInputField();
    expect(screen.queryByText(/L'email est requis/i)).not.toBeInTheDocument();
  });

  it.each([
    ['text'],
    ['number'],
    ['password'],
  ])('renders input with type %s', (type) => {
    renderInputField({ type });
    const input = screen.getByLabelText(defaultProps.label);
    expect(input).toHaveAttribute('type', type);
  }); 

  it('renders textarea when type is "textarea"', () => {
    renderInputField({ type: 'textarea' });
    const textarea = screen.getByLabelText(defaultProps.label);
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });
});