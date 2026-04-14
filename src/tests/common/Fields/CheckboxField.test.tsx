import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { UseFormRegister } from "react-hook-form";
import type { RegisterFormData } from "../../../types/User";
import CheckboxField from "../../../common/Fields/CheckboxField";
import type { InputFieldProps } from "../../../types/Field";

describe("CheckboxField", () => {
  const mockRegister = vi.fn(() => ({}));

  const defaultProps: InputFieldProps<RegisterFormData> = {
    label: "Available",
    name: "email",
    htmlFor: "available",
    id: "available",
    register: mockRegister as unknown as UseFormRegister<RegisterFormData>,
    type: "checkbox",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders checkbox and label in the nominal case", () => {
    render(<CheckboxField {...defaultProps} />);

    expect(screen.getByRole("checkbox")).toHaveAttribute("id", "available");
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(mockRegister).toHaveBeenCalledWith("email");
  });

  it("links label with checkbox through htmlFor", () => {
    render(<CheckboxField {...defaultProps} />);

    expect(screen.getByText("Available").tagName).toBe("LABEL");
    expect(screen.getByText("Available")).toHaveAttribute("for", "available");
  });
});
