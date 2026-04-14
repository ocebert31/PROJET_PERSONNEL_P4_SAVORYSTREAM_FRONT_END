import { render, screen } from '@testing-library/react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import InputFieldForm from '../../../common/Fields/InputFieldForm';
import type { InputFieldProps } from '../../../types/Field';
import type { RegisterFormData } from '../../../types/User';

vi.mock('../../../common/Fields/InputField', () => ({
  default: () => <div data-testid="input-field" />,
}));

vi.mock('../../../common/Fields/TextareaField', () => ({
  default: () => <div data-testid="textarea-field" />,
}));

vi.mock('../../../common/Fields/SelectField', () => ({
  default: () => <div data-testid="select-field" />,
}));

vi.mock('../../../common/Fields/CheckboxField', () => ({
  default: () => <div data-testid="checkbox-field" />,
}));

describe('InputFieldForm', () => {
  const mockRegister = vi.fn();

  const defaultProps: InputFieldProps<RegisterFormData> = {
    label: 'Test label',
    name: 'email',
    register: mockRegister as unknown as UseFormRegister<RegisterFormData>,
    errors: undefined,
    id: 'email-input',
    htmlFor: 'email-input',
    type: 'text',
  };

  const renderComponent = (overrides: Partial<InputFieldProps<RegisterFormData>> = {}) =>
    render(<InputFieldForm {...defaultProps} {...overrides} />);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the nominal text branch with label', () => {
    renderComponent();

    expect(screen.getByText('Test label')).toBeInTheDocument();
    expect(screen.getByTestId("input-field")).toBeInTheDocument();
  });

  it('should render textarea branch when type is textarea', () => {
    renderComponent({ type: 'textarea' });

    expect(screen.getByTestId("textarea-field")).toBeInTheDocument();
    expect(screen.queryByTestId("input-field")).not.toBeInTheDocument();
  });

  it('should render select branch when type is select', () => {
    renderComponent({ type: 'select' });

    expect(screen.getByTestId("select-field")).toBeInTheDocument();
    expect(screen.queryByTestId("input-field")).not.toBeInTheDocument();
  });

  it('should render checkbox branch and hide wrapper label', () => {
    renderComponent({ type: 'checkbox' });

    expect(screen.getByTestId("checkbox-field")).toBeInTheDocument();
    expect(screen.queryByText('Test label')).not.toBeInTheDocument();
  });

  it('should show field error message when provided', () => {
    const errors: FieldErrors<RegisterFormData> = {
      email: { type: 'required', message: 'Email is required.' },
    };
    renderComponent({ errors });

    expect(screen.getByText('Email is required.')).toBeInTheDocument();
  });

  it('should render additional content under the field', () => {
    renderComponent({ additionalContent: <span>Helper note</span> });

    expect(screen.getByText('Helper note')).toBeInTheDocument();
  });
});
