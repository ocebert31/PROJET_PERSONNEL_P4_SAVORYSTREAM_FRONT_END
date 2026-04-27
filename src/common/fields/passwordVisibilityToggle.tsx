import { Eye, EyeOff } from "lucide-react";
import IconButton from "../button/iconButton";

type PasswordVisibilityToggleProps = {
  isVisible: boolean;
  onToggle: () => void;
};

function PasswordVisibilityToggle({ isVisible, onToggle }: PasswordVisibilityToggleProps) {
  return (
    <IconButton type="button" variant="ghost" size="sm" onClick={onToggle} className="absolute inset-y-0 right-3" aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
      {isVisible ? (
        <EyeOff aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
      ) : (
        <Eye aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
      )}
    </IconButton>
  );
}

export default PasswordVisibilityToggle;
