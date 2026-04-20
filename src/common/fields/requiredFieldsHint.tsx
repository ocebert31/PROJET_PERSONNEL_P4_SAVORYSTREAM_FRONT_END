type RequiredFieldsHintProps = {
  className?: string;
};

function RequiredFieldsHint({ className = "text-xs text-muted" }: RequiredFieldsHintProps) {
  return (
    <p className={className}>
      Les champs marques <span className="font-semibold text-destructive">*</span> sont obligatoires.
    </p>
  );
}

export default RequiredFieldsHint;
