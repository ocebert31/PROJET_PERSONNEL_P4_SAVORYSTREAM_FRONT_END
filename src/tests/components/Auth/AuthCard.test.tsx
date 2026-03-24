import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AuthCard from "../../../components/auth/AuthCard";

describe("AuthCard", () => {
  it("renders eyebrow, title and subtitle", () => {
    render(
      <AuthCard
        eyebrow="Eyebrow text"
        title="Card title"
        subtitle="Card subtitle"
        footer={<p>Footer content</p>}
      >
        <p>Main content</p>
      </AuthCard>
    );

    expect(screen.getByText("Eyebrow text")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Card title" })).toBeInTheDocument();
    expect(screen.getByText("Card subtitle")).toBeInTheDocument();
  });

  it("renders children and footer", () => {
    render(
      <AuthCard
        eyebrow="E"
        title="T"
        subtitle="S"
        footer={<footer>Footer block</footer>}
      >
        <form aria-label="auth form">
          <input type="text" name="field" />
        </form>
      </AuthCard>
    );

    expect(screen.getByRole("form", { name: "auth form" })).toBeInTheDocument();
    expect(screen.getByText("Footer block")).toBeInTheDocument();
  });
});
