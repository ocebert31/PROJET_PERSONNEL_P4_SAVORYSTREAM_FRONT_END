import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FieldWrapper from "../../../common/Fields/FieldWrapper";

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
      <FieldWrapper label="Email" htmlFor="email" error="Email is required.">
        <input id="email" />
      </FieldWrapper>,
    );

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
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
