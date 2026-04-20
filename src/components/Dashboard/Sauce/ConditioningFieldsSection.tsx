import type { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";
import InputFieldForm from "../../../common/fields/inputFieldForm";
import type { SauceCreateFormValues } from "../../../schemas/sauceCreateSchema";
import Button from "../../../common/button/button";

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
            <Button type="button" variant="secondary" size="sm" onClick={() => onRemove(index)}>
              Supprimer ce conditionnement
            </Button>
          ) : null}
        </div>
      ))}
      <Button type="button" variant="secondary" size="md" onClick={onAppend}>
        Ajouter un conditionnement
      </Button>
    </div>
  );
}
