import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PasswordVisibilityToggle from "../../../common/Fields/PasswordVisibilityToggle";

describe("PasswordVisibilityToggle", () => {
  it("shows 'Afficher' label when password is hidden", () => {
    render(<PasswordVisibilityToggle isVisible={false} onToggle={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Afficher le mot de passe/i })).toBeInTheDocument();
  });

  it("shows 'Masquer' label when password is visible", () => {
    render(<PasswordVisibilityToggle isVisible onToggle={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Masquer le mot de passe/i })).toBeInTheDocument();
  });

  it("calls onToggle when clicked", async () => {
    const onToggle = vi.fn();
    render(<PasswordVisibilityToggle isVisible={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button", { name: /Afficher le mot de passe/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
