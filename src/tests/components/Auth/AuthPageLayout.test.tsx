import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AuthPageLayout from "../../../components/auth/AuthPageLayout";

describe("AuthPageLayout", () => {
  it("renders children inside the layout", () => {
    render(
      <AuthPageLayout variant="primary">
        <p>Layout child</p>
      </AuthPageLayout>
    );
    expect(screen.getByText("Layout child")).toBeInTheDocument();
  });

  it("uses primary gradient classes when variant is primary", () => {
    const { container } = render(
      <AuthPageLayout variant="primary">
        <span>inner</span>
      </AuthPageLayout>
    );
    const gradient = container.querySelector('[aria-hidden="true"]');
    expect(gradient).toBeTruthy();
    expect(gradient?.className).toContain("from-primary");
  });

  it("uses secondary gradient classes when variant is secondary", () => {
    const { container } = render(
      <AuthPageLayout variant="secondary">
        <span>inner</span>
      </AuthPageLayout>
    );
    const gradient = container.querySelector('[aria-hidden="true"]');
    expect(gradient).toBeTruthy();
    expect(gradient?.className).toContain("from-secondary");
  });
});
