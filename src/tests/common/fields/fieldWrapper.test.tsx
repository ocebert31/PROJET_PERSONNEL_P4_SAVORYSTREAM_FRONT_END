import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FieldWrapper from "../../../common/fields/fieldWrapper";

describe("FieldWrapper", () => {
  it("renders label, child content and no error in the nominal case", () => {
    render(
      <FieldWrapper label="Email" htmlFor="email" error={null}>
        <input id="email" />
      </FieldWrapper>,
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  it("renders the error message when provided", () => {
    render(
      <FieldWrapper label="Email" htmlFor="email" errorId="email-error" error="Email is required.">
        <input id="email" />
      </FieldWrapper>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Email is required.");
    expect(alert).toHaveAttribute("id", "email-error");
  });

  it("renders additional content when provided", () => {
    render(
      <FieldWrapper error={null} additionalContent={<p>Helper text</p>}>
        <input id="email" />
      </FieldWrapper>,
    );

    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });
});
