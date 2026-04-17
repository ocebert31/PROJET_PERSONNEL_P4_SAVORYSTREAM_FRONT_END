import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import SessionInitializer from "../../init/sessionInitializer";
import * as authContextModule from "@/context/authContext";
import * as authenticationService from "@/services/users/authentication";

vi.mock("@/context/authContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/context/authContext")>();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock("@/services/users/authentication", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/users/authentication")>();
  return {
    ...actual,
    bootstrapSession: vi.fn(),
  };
});

function mockUseAuth(refreshUser = vi.fn().mockResolvedValue(undefined)) {
  vi.mocked(authContextModule.useAuth).mockReturnValue({
    user: null,
    refreshUser,
  });
  return refreshUser;
}

describe("SessionInitializer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("renders nothing, then runs bootstrapSession and refreshUser once in that order", async () => {
      const callOrder: string[] = [];
      const refreshUser = vi.fn(async () => {
        callOrder.push("refreshUser");
      });
      mockUseAuth(refreshUser);
      vi.mocked(authenticationService.bootstrapSession).mockImplementation(async () => {
        callOrder.push("bootstrapSession");
        return true;
      });

      const { container } = render(<SessionInitializer />);

      expect(container).toBeEmptyDOMElement();

      await waitFor(() => {
        expect(authenticationService.bootstrapSession).toHaveBeenCalledTimes(1);
        expect(refreshUser).toHaveBeenCalledTimes(1);
        expect(callOrder).toEqual(["bootstrapSession", "refreshUser"]);
      });
    });
  });

  describe("variations", () => {
    it("still calls refreshUser when bootstrapSession resolves false", async () => {
      const refreshUser = mockUseAuth();
      vi.mocked(authenticationService.bootstrapSession).mockResolvedValue(false);

      render(<SessionInitializer />);

      await waitFor(() => {
        expect(authenticationService.bootstrapSession).toHaveBeenCalledTimes(1);
        expect(refreshUser).toHaveBeenCalledTimes(1);
      });
    });

    it("does not call refreshUser when unmounted before bootstrapSession settles", async () => {
      let resolveBootstrap!: (value: boolean) => void;
      const bootstrapPending = new Promise<boolean>((resolve) => {
        resolveBootstrap = resolve;
      });
      vi.mocked(authenticationService.bootstrapSession).mockImplementation(() => bootstrapPending);

      const refreshUser = mockUseAuth();

      const { unmount } = render(<SessionInitializer />);
      unmount();
      resolveBootstrap(true);

      await waitFor(() => {
        expect(refreshUser).not.toHaveBeenCalled();
      });
    });

    it("does not call refreshUser when bootstrapSession rejects", async () => {
      vi.mocked(authenticationService.bootstrapSession).mockRejectedValue(new Error("bootstrap failed"));

      const refreshUser = mockUseAuth();

      render(<SessionInitializer />);

      await waitFor(() => {
        expect(authenticationService.bootstrapSession).toHaveBeenCalledTimes(1);
        expect(refreshUser).not.toHaveBeenCalled();
      });
    });
  });
});
