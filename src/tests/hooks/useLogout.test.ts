import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLogout } from "../../hooks/useLogout";
import * as authContext from "../../context/authContext";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../context/authContext", () => ({
  useAuth: vi.fn(),
}));

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("calls auth logout then navigates to login", async () => {
      const logoutMock = vi.fn().mockResolvedValue(undefined);
      vi.mocked(authContext.useAuth).mockReturnValue({
        user: null,
        refreshUser: vi.fn(),
        logout: logoutMock,
      });

      const { result } = renderHook(() => useLogout());

      await act(async () => {
        await result.current();
      });

      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith("/login", { replace: true });
    });
  });
});
