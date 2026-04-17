import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UseFormRegister } from "react-hook-form";
import type { RegisterFormData } from "../../../types/user";
import InputField from "../../../common/fields/inputField";
import type { InputFieldProps } from "../../../types/field";

describe("InputField", () => {
  const mockRegister = vi.fn(() => ({}));

  const defaultProps: InputFieldProps<RegisterFormData> = {
    label: "Email",
    name: "email",
    htmlFor: "email",
    id: "email",
    register: mockRegister as unknown as UseFormRegister<RegisterFormData>,
    type: "text",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a text input and registers by name in the nominal case", () => {
    render(<InputField {...defaultProps} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("id", "email");
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    expect(mockRegister).toHaveBeenCalledWith("email");
  });

  it("registers number fields with valueAsNumber option", () => {
    render(<InputField {...defaultProps} name="phoneNumber" id="stock" type="number" valueAsNumber />);

    expect(mockRegister).toHaveBeenCalledWith("phoneNumber", { valueAsNumber: true });
  });

  it("passes optional native attributes to the input", () => {
    render(<InputField {...defaultProps} disabled min={0} step={1} accept="image/*" />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("step", "1");
    expect(input).toHaveAttribute("accept", "image/*");
  });

  it("applies accessibility attributes when provided", () => {
    render(<InputField {...defaultProps} required ariaDescribedBy="email-error" ariaInvalid />);

    const input = screen.getByRole("textbox");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("toggles password visibility with the eye button", async () => {
    render(<InputField {...defaultProps} name="password" id="password" type="password" />);

    const input = document.getElementById("password");
    expect(input).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: /Afficher le mot de passe/i }));
    expect(screen.getByRole("button", { name: /Masquer le mot de passe/i })).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("does not render visibility toggle for non-password inputs", () => {
    render(<InputField {...defaultProps} type="text" />);

    expect(screen.queryByRole("button", { name: /mot de passe/i })).not.toBeInTheDocument();
  });
});
