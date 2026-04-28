import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ComponentProps } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { UserPublic } from "../../../types/user";
import * as authContext from "../../../context/authContext";
import ProtectedAdminRoute from "../../../routes/guards/protectedAdminRoute";

const hoisted = vi.hoisted(() => ({
  navigateProps: [] as Array<Pick<ComponentProps<typeof import("react-router-dom").Navigate>, "to" | "replace" | "state">>,
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  const Navigate = (props: ComponentProps<typeof actual.Navigate>) => {
    hoisted.navigateProps.push({
      to: props.to,
      replace: props.replace,
      state: props.state,
    });
    return <actual.Navigate {...props} />;
  };
  return { ...actual, Navigate };
});

vi.mock("../../../context/authContext", () => ({
  useAuth: vi.fn(),
}));

function adminUser(overrides: Partial<UserPublic> = {}): UserPublic {
  const now = new Date().toISOString();
  return {
    id: "1",
    first_name: "Admin",
    last_name: "User",
    email: "admin@example.com",
    phone_number: null,
    role: "admin",
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

function renderWithMemoryRouter(user: UserPublic | null) {
  vi.mocked(authContext.useAuth).mockReturnValue({
    user,
    refreshUser: vi.fn(),
    logout: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={["/dashboard/sauces/create"]}>
      <Routes>
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/dashboard/sauces/create" element={<div data-testid="admin-outlet">Contenu admin</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedAdminRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.navigateProps.length = 0;
  });

  describe("nominal case", () => {
    it("renders the nested route when the user is an admin", async () => {
      renderWithMemoryRouter(adminUser());

      await waitFor(() => {
        expect(screen.getByTestId("admin-outlet")).toHaveTextContent("Contenu admin");
      });
      expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
      expect(hoisted.navigateProps).toHaveLength(0);
    });
  });

  describe("variations", () => {
    it("redirects to /login when there is no user", async () => {
      renderWithMemoryRouter(null);

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("admin-outlet")).not.toBeInTheDocument();
    });

    it("redirects to /login when the user is not an admin", async () => {
      renderWithMemoryRouter(adminUser({ role: "user" }));

      await waitFor(() => {
        expect(screen.getByTestId("login-page")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("admin-outlet")).not.toBeInTheDocument();
    });

    it("passes replace and from path to Navigate when redirecting", async () => {
      renderWithMemoryRouter(null);

      await waitFor(() => {
        expect(hoisted.navigateProps.length).toBeGreaterThanOrEqual(1);
      });
      expect(hoisted.navigateProps[0]).toMatchObject({
        to: "/login",
        replace: true,
        state: { from: "/dashboard/sauces/create" },
      });
    });
  });
});
