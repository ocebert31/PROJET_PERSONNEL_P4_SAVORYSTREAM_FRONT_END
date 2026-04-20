import IconButton from "../button/IconButton";

type PasswordVisibilityToggleProps = {
  isVisible: boolean;
  onToggle: () => void;
};

function PasswordVisibilityToggle({ isVisible, onToggle }: PasswordVisibilityToggleProps) {
  return (
    <IconButton type="button" variant="ghost" size="sm" onClick={onToggle} className="absolute inset-y-0 right-3" aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
      {isVisible ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.59a2 2 0 102.83 2.83" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.88 5.08A10.94 10.94 0 0112 5c5.01 0 9.27 3.13 10.95 7-1.06 2.32-2.92 4.27-5.24 5.45M6.61 6.61C4.28 7.79 2.42 9.74 1.36 12A11.95 11.95 0 004.32 16"
          />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.46 12C3.73 7.94 7.53 5 12 5s8.27 2.94 9.54 7c-1.27 4.06-5.07 7-9.54 7s-8.27-2.94-9.54-7z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </IconButton>
  );
}

export default PasswordVisibilityToggle;
