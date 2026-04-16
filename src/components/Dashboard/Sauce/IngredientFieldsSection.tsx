import type { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";
import InputFieldForm from "../../../common/Fields/InputFieldForm";
import type { SauceCreateFormValues } from "../../../schemas/sauceCreateSchema";

type IngredientFieldsSectionProps = {
  register: UseFormRegister<SauceCreateFormValues>;
  errors: FieldErrors<SauceCreateFormValues>;
  fields: FieldArrayWithId<SauceCreateFormValues, "ingredients", "id">[];
  onAppend: () => void;
  onRemove: (index: number) => void;
};

export function IngredientFieldsSection({ register, errors, fields, onAppend, onRemove }: IngredientFieldsSectionProps) {
  return (
    <div className="mt-4 space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-4 rounded-2xl border border-border/70 p-4 sm:grid-cols-2">
          <InputFieldForm label={`Nom #${index + 1}`} name={`ingredients.${index}.name` as const}
            htmlFor={`ing-name-${index}`} id={`ing-name-${index}`} register={register}
            errors={errors} required autoComplete="off"/>
          <InputFieldForm label={`Quantité #${index + 1} (ex. 30%)`} name={`ingredients.${index}.quantity` as const}
            htmlFor={`ing-qty-${index}`} id={`ing-qty-${index}`} register={register}
            errors={errors} required autoComplete="off"/>
          {fields.length > 1 ? (
            <button type="button" onClick={() => onRemove(index)} className="min-h-11 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/90 transition hover:bg-background">
              Supprimer cet ingrédient
            </button>
          ) : null}
        </div>
      ))}
      <button type="button" onClick={onAppend} className="min-h-11 rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-background">
        Ajouter un ingrédient
      </button>
    </div>
  );
}
