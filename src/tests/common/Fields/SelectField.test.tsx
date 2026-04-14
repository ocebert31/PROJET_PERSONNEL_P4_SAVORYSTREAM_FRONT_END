import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { UseFormRegister } from "react-hook-form";
import type { RegisterFormData } from "../../../types/User";
import SelectField from "../../../common/Fields/SelectField";
import type { InputFieldProps } from "../../../types/Field";

describe("SelectField", () => {
  const mockRegister = vi.fn(() => ({}));

  const defaultProps: InputFieldProps<RegisterFormData> = {
    label: "Category",
    name: "email",
    htmlFor: "category",
    id: "category",
    register: mockRegister as unknown as UseFormRegister<RegisterFormData>,
    type: "select",
    options: [
      { value: "hot", label: "Hot" },
      { value: "mild", label: "Mild" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a select with provided options in the nominal case", () => {
    render(<SelectField {...defaultProps} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Hot" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Mild" })).toBeInTheDocument();
    expect(mockRegister).toHaveBeenCalledWith("email");
  });

  it("renders the placeholder option when provided", () => {
    render(<SelectField {...defaultProps} placeholderOption={{ value: "", label: "Choose one" }} />);

    expect(screen.getByRole("option", { name: "Choose one" })).toBeInTheDocument();
  });

  it("applies disabled attribute when provided", () => {
    render(<SelectField {...defaultProps} disabled />);

    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
