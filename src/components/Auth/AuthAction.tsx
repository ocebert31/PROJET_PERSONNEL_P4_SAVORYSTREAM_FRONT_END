import { useNavigate } from "react-router-dom";
import type { UserPublic } from "../../types/user";
import { useLogout } from "../../hooks/useLogout";
import Button from "../../common/button/button";

type AuthActionProps = {
  user: UserPublic | null;
};

function AuthAction({ user }: AuthActionProps) {
  const logout = useLogout();
  const navigate = useNavigate();

  if (user) {
    return (
      <Button type="button" variant="primary" onClick={() => void logout()}>
        Déconnexion
      </Button>
    );
  }

  return (
    <>
      <Button type="button" variant="ghost" onClick={() => navigate("/register")}>
        Inscription
      </Button>
      <Button type="button" variant="primary" onClick={() => navigate("/login")}>
        Connexion
      </Button>
    </>
  );
}

export default AuthAction;
