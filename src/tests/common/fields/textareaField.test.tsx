import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { UseFormRegister } from "react-hook-form";
import type { RegisterFormData } from "../../../types/user";
import TextareaField from "../../../common/fields/textareaField";
import type { InputFieldProps } from "../../../types/field";

describe("TextareaField", () => {
  const mockRegister = vi.fn(() => ({}));

  const defaultProps: InputFieldProps<RegisterFormData> = {
    label: "Description",
    name: "email",
    htmlFor: "description",
    id: "description",
    register: mockRegister as unknown as UseFormRegister<RegisterFormData>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a textarea and registers the field in the nominal case", () => {
    render(<TextareaField {...defaultProps} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("id", "description");
    expect(mockRegister).toHaveBeenCalledWith("email");
  });

  it("applies disabled attribute when provided", () => {
    render(<TextareaField {...defaultProps} disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
