import { render, screen } from '@testing-library/react';
import InputField from '../../common/InputFieldForm';
import { vi, describe, expect, it, beforeEach } from 'vitest';

describe('InputField Component', () => {
  const mockRegister = vi.fn();

  const defaultProps = {
    label: 'TestLabel',
    name: 'email',
    register: mockRegister,
    errors: '',
    id: 'email-input',
    htmlFor: 'email-input',
    type: 'text',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderInputField = (props = {}) => render(<InputField {...defaultProps} {...props} />);

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
    const errors = { email: { message: "L'email est requis" } };
    renderInputField({ name: 'email', errors });
    expect(screen.getByText(errors.email.message)).toBeInTheDocument();
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
});