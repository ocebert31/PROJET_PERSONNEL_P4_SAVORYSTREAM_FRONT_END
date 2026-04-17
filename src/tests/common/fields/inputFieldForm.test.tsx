import { render, screen } from "@testing-library/react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { describe, expect, it, vi, beforeEach } from "vitest";
import InputFieldForm, { getErrorMessage, getNestedValue } from "../../../common/fields/inputFieldForm";
import type { InputFieldProps } from "../../../types/field";
import type { RegisterFormData } from "../../../types/user";

type MockFieldComponentProps = {
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  type?: string;
};

const hoisted = vi.hoisted(() => ({
  inputProps: undefined as MockFieldComponentProps | undefined,
  textareaProps: undefined as MockFieldComponentProps | undefined,
  selectProps: undefined as MockFieldComponentProps | undefined,
  checkboxProps: undefined as MockFieldComponentProps | undefined,
}));

vi.mock("../../../common/fields/inputField", () => ({
  default: (props: MockFieldComponentProps) => {
    hoisted.inputProps = props;
    return <div data-testid="input-field" />;
  },
}));

vi.mock("../../../common/fields/textareaField", () => ({
  default: (props: MockFieldComponentProps) => {
    hoisted.textareaProps = props;
    return <div data-testid="textarea-field" />;
  },
}));

vi.mock("../../../common/fields/selectField", () => ({
  default: (props: MockFieldComponentProps) => {
    hoisted.selectProps = props;
    return <div data-testid="select-field" />;
  },
}));

vi.mock("../../../common/fields/checkboxField", () => ({
  default: (props: MockFieldComponentProps) => {
    hoisted.checkboxProps = props;
    return <div data-testid="checkbox-field" />;
  },
}));

describe("getNestedValue", () => {
  it("returns nested value in nominal path", () => {
    const source = { a: { b: { c: "ok" } } };
    expect(getNestedValue(source, "a.b.c")).toBe("ok");
  });

  it("returns undefined when path does not exist", () => {
    const source = { a: { b: { c: "ok" } } };
    expect(getNestedValue(source, "a.x.c")).toBeUndefined();
  });
});

describe("getErrorMessage", () => {
  it("returns nominal error message for flat field", () => {
    const errors: FieldErrors<RegisterFormData> = {
      email: { type: "required", message: "Email requis." },
    };
    expect(getErrorMessage(errors, "email")).toBe("Email requis.");
  });

  it("returns error message for nested path", () => {
    const errors = {
      conditionings: [{ volume: { type: "required", message: "Volume requis." } }],
    } as unknown as FieldErrors<RegisterFormData>;
    expect(getErrorMessage(errors, "conditionings.0.volume" as keyof RegisterFormData & string)).toBe("Volume requis.");
  });

  it("returns null when message is missing", () => {
    const errors: FieldErrors<RegisterFormData> = {
      email: { type: "required" },
    };
    expect(getErrorMessage(errors, "email")).toBeNull();
  });
});

describe("InputFieldForm", () => {
  const mockRegister = vi.fn();

  const defaultProps: InputFieldProps<RegisterFormData> = {
    label: "Test label",
    name: "email",
    register: mockRegister as unknown as UseFormRegister<RegisterFormData>,
    errors: undefined,
    id: "email-input",
    htmlFor: "email-input",
    type: "text",
  };

  const renderComponent = (overrides: Partial<InputFieldProps<RegisterFormData>> = {}) =>
    render(<InputFieldForm {...defaultProps} {...overrides} />);

  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.inputProps = undefined;
    hoisted.textareaProps = undefined;
    hoisted.selectProps = undefined;
    hoisted.checkboxProps = undefined;
  });

  it("renders nominal text branch with label and no error aria", () => {
    renderComponent();

    expect(screen.getByText("Test label")).toBeInTheDocument();
    expect(screen.getByTestId("input-field")).toBeInTheDocument();
    expect(hoisted.inputProps?.ariaInvalid).toBe(false);
    expect(hoisted.inputProps?.ariaDescribedBy).toBeUndefined();
  });

  it("renders textarea branch when type is textarea", () => {
    renderComponent({ type: "textarea" });

    expect(screen.getByTestId("textarea-field")).toBeInTheDocument();
    expect(screen.queryByTestId("input-field")).not.toBeInTheDocument();
  });

  it("renders select branch when type is select", () => {
    renderComponent({ type: "select" });

    expect(screen.getByTestId("select-field")).toBeInTheDocument();
    expect(screen.queryByTestId("input-field")).not.toBeInTheDocument();
  });

  it("renders checkbox branch and hides wrapper label", () => {
    renderComponent({ type: "checkbox" });

    expect(screen.getByTestId("checkbox-field")).toBeInTheDocument();
    expect(screen.queryByText("Test label")).not.toBeInTheDocument();
  });

  it("shows error message and forwards aria metadata", () => {
    const errors: FieldErrors<RegisterFormData> = {
      email: { type: "required", message: "Email is required." },
    };
    renderComponent({ errors });

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(hoisted.inputProps?.ariaInvalid).toBe(true);
    expect(hoisted.inputProps?.ariaDescribedBy).toBe("email-input-error");
  });

  it("renders additional content under the field", () => {
    renderComponent({ additionalContent: <span>Helper note</span> });
    expect(screen.getByText("Helper note")).toBeInTheDocument();
  });
});
