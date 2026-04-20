type FormLiveFeedbackProps = {
  touchedCount: number;
  touchedErrorCount: number;
  isValid: boolean;
};

function FormLiveFeedback({ touchedCount, touchedErrorCount, isValid }: FormLiveFeedbackProps) {
  const hasLiveErrors = touchedErrorCount > 0;
  const liveFeedbackRole = hasLiveErrors ? "alert" : "status";
  const liveFeedbackClassName = `text-caption ${hasLiveErrors ? "font-medium text-destructive" : "text-muted"}`;
  const liveFeedbackMessage = hasLiveErrors
    ? `${touchedErrorCount} champ${touchedErrorCount > 1 ? "s" : ""} à corriger.`
    : touchedCount > 0 && isValid
      ? "Formulaire valide pour l'instant."
      : "Le formulaire est valide au fur et à mesure de votre saisie.";

  return (
    <p aria-live="polite" className={liveFeedbackClassName} role={liveFeedbackRole}>
      {liveFeedbackMessage}
    </p>
  );
}

export default FormLiveFeedback;
