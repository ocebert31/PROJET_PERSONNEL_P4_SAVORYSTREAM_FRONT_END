import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AuthAction from "../../../components/Auth/AuthAction";
import { useLogout } from "../../../hooks/useLogout";

const navigateMock = vi.fn();
const logoutActionMock = vi.fn().mockResolvedValue(undefined);

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../../hooks/useLogout", () => ({
  useLogout: vi.fn(),
}));

function renderAuthAction(user: {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
} | null) {
  return render(
    <MemoryRouter>
      <AuthAction user={user} />
    </MemoryRouter>,
  );
}

describe("AuthAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogout).mockReturnValue(logoutActionMock);
  });

  it("renders register and login buttons when user is not authenticated", () => {
    renderAuthAction(null);

    expect(screen.getByRole("button", { name: "Inscription" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Connexion" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Déconnexion" })).not.toBeInTheDocument();
  });

  it("navigates to register and login routes when public buttons are clicked", async () => {
    const user = userEvent.setup();
    renderAuthAction(null);

    await user.click(screen.getByRole("button", { name: "Inscription" }));
    await user.click(screen.getByRole("button", { name: "Connexion" }));

    expect(navigateMock).toHaveBeenCalledWith("/register");
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  it("renders logout button when user is authenticated", () => {
    renderAuthAction({
      id: "1",
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      phone_number: null,
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    expect(screen.getByRole("button", { name: "Déconnexion" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Inscription" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Connexion" })).not.toBeInTheDocument();
  });

  it("calls logout action when clicking logout button", async () => {
    const user = userEvent.setup();
    renderAuthAction({
      id: "1",
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      phone_number: null,
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await user.click(screen.getByRole("button", { name: "Déconnexion" }));

    expect(logoutActionMock).toHaveBeenCalledTimes(1);
  });
});
