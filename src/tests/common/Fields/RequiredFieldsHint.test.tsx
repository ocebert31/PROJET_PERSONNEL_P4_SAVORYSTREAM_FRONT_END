import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RequiredFieldsHint from "../../../common/Fields/RequiredFieldsHint";

describe("RequiredFieldsHint", () => {
  it("renders required fields message with default class", () => {
    render(<RequiredFieldsHint />);

    const message = screen.getByText(/Les champs marques/i);
    expect(message).toBeInTheDocument();
    expect(message.tagName).toBe("P");
    expect(message).toHaveClass("text-xs", "text-muted");
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    render(<RequiredFieldsHint className="mt-2 text-sm text-foreground" />);

    const message = screen.getByText(/Les champs marques/i);
    expect(message).toHaveClass("mt-2", "text-sm", "text-foreground");
  });
});
