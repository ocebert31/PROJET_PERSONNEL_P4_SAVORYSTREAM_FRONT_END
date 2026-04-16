import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

vi.mock("../common/Toast/ToastProvider", () => ({
  ToastProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="toast-provider">{children}</div>
  ),
}));

vi.mock("../context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

vi.mock("../context/ConsentContext", () => ({
  ConsentProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="consent-provider">{children}</div>
  ),
}));

vi.mock("../init/SessionInitializer", () => ({
  default: () => <div data-testid="session-initializer" />,
}));

vi.mock("../components/Header/Header", () => ({
  default: () => <header data-testid="header" />,
}));

vi.mock("../routes/RouterComponent", () => ({
  default: () => <div data-testid="router-component" />,
}));

vi.mock("../components/Footer/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

vi.mock("../components/Consent/CookieConsentBanner", () => ({
  default: () => <div data-testid="cookie-consent-banner" />,
}));

describe("App", () => {
  it("wires providers and session initializer", () => {
    render(<App />);
    expect(screen.getByTestId("toast-provider")).toBeInTheDocument();
    expect(screen.getByTestId("consent-provider")).toBeInTheDocument();
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("session-initializer")).toBeInTheDocument();
  });

  it("renders layout children (Header, RouterComponent, Footer)", () => {
    render(<App />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("router-component")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("cookie-consent-banner")).toBeInTheDocument();
  });

  it("renders an accessible skip link to main content", () => {
    render(<App />);
    const skipLink = screen.getByRole("link", { name: /Aller au contenu principal/i });
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });
});
