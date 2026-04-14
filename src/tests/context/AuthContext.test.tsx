import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import * as authenticationService from "../../services/users/authentication";
import type { UserPublic } from "../../types/User";

vi.mock("../../services/users/authentication", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/users/authentication")>();
  return {
    ...actual,
    fetchCurrentUser: vi.fn(),
  };
});

function makeUser(overrides: Partial<UserPublic> = {}): UserPublic {
  const now = new Date().toISOString();
  return {
    id: "1",
    first_name: "Jane",
    last_name: "Doe",
    email: "jane@example.com",
    phone_number: null,
    role: "admin",
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

function AuthProbe() {
  const { user, refreshUser } = useAuth();
  return (
    <div>
      <span data-testid="user-email">{user?.email ?? "none"}</span>
      <button type="button" onClick={() => void refreshUser()}>
        refresh
      </button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("starts with no user and updates after refreshUser resolves with a profile", async () => {
      const user = userEvent.setup();
      vi.mocked(authenticationService.fetchCurrentUser).mockResolvedValue(makeUser());

      render(
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>,
      );

      expect(screen.getByTestId("user-email")).toHaveTextContent("none");

      await user.click(screen.getByRole("button", { name: "refresh" }));

      await waitFor(() => {
        expect(authenticationService.fetchCurrentUser).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId("user-email")).toHaveTextContent("jane@example.com");
      });
    });
  });

  describe("variations", () => {
    it("throws when useAuth is used outside AuthProvider", () => {
      const Test = () => {
        useAuth();
        return null;
      };
      expect(() => render(<Test />)).toThrow("useAuth doit être utilisé dans un AuthProvider.");
    });

    it("leaves user null when fetchCurrentUser resolves null", async () => {
      const user = userEvent.setup();
      vi.mocked(authenticationService.fetchCurrentUser).mockResolvedValue(null);

      render(
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>,
      );

      await user.click(screen.getByRole("button", { name: "refresh" }));

      await waitFor(() => {
        expect(authenticationService.fetchCurrentUser).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId("user-email")).toHaveTextContent("none");
      });
    });

    it("clears user when a later refreshUser resolves null after a populated session", async () => {
      const user = userEvent.setup();
      vi.mocked(authenticationService.fetchCurrentUser)
        .mockResolvedValueOnce(makeUser({ email: "first@example.com" }))
        .mockResolvedValueOnce(null);

      render(
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>,
      );

      await user.click(screen.getByRole("button", { name: "refresh" }));
      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent("first@example.com");
      });

      await user.click(screen.getByRole("button", { name: "refresh" }));
      await waitFor(() => {
        expect(authenticationService.fetchCurrentUser).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId("user-email")).toHaveTextContent("none");
      });
    });

    it("replaces user when refreshUser resolves a different profile", async () => {
      const user = userEvent.setup();
      vi.mocked(authenticationService.fetchCurrentUser)
        .mockResolvedValueOnce(makeUser({ id: "1", email: "a@example.com" }))
        .mockResolvedValueOnce(makeUser({ id: "2", email: "b@example.com", first_name: "Bob" }));

      render(
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>,
      );

      await user.click(screen.getByRole("button", { name: "refresh" }));
      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent("a@example.com");
      });

      await user.click(screen.getByRole("button", { name: "refresh" }));
      await waitFor(() => {
        expect(authenticationService.fetchCurrentUser).toHaveBeenCalledTimes(2);
        expect(screen.getByTestId("user-email")).toHaveTextContent("b@example.com");
      });
    });
  });
});
