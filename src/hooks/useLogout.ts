import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useCallback(async () => {
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);
}
