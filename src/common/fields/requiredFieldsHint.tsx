type RequiredFieldsHintProps = {
  className?: string;
};

function RequiredFieldsHint({ className = "text-xs text-muted" }: RequiredFieldsHintProps) {
  return (
    <p className={className}>
      Les champs marques <span className="font-semibold text-rose-700">*</span> sont obligatoires.
    </p>
  );
}

export default RequiredFieldsHint;
