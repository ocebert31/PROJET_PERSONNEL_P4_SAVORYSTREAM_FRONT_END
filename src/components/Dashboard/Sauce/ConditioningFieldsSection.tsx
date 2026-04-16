import type { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";
import InputFieldForm from "../../../common/Fields/InputFieldForm";
import type { SauceCreateFormValues } from "../../../schemas/sauceCreateSchema";

type ConditioningFieldsSectionProps = { 
  register: UseFormRegister<SauceCreateFormValues>; 
  errors: FieldErrors<SauceCreateFormValues>; 
  fields: FieldArrayWithId<SauceCreateFormValues, "conditionings", "id">[]; 
  onAppend: () => void; 
  onRemove: (index: number) => void 
};

export function ConditioningFieldsSection({ register, errors, fields, onAppend, onRemove }: ConditioningFieldsSectionProps) {
  return (
    <div className="mt-4 space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-2xl border border-border/70 p-4 sm:grid-cols-2">
          <InputFieldForm label={`Volume #${index + 1} (ex. 250ml)`} name={`conditionings.${index}.volume` as const}
            htmlFor={`cond-vol-${index}`} id={`cond-vol-${index}`} register={register}
            errors={errors} required autoComplete="off"/>
          <InputFieldForm label={`Prix #${index + 1} (ex. 6.90)`} name={`conditionings.${index}.price` as const}
            htmlFor={`cond-price-${index}`} id={`cond-price-${index}`}register={register}
            errors={errors} type="number" required min={0} step="0.01" inputMode="decimal"/>
          {fields.length > 1 ? (
            <button type="button" onClick={() => onRemove(index)} className="min-h-11 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/90 transition hover:bg-background">
              Supprimer ce conditionnement
            </button>
          ) : null}
        </div>
      ))}
      <button type="button" onClick={onAppend} className="min-h-11 rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-background">
        Ajouter un conditionnement
      </button>
    </div>
  );
}
