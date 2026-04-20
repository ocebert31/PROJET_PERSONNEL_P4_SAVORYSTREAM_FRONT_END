import type { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";
import InputFieldForm from "../../../common/fields/inputFieldForm";
import type { SauceCreateFormValues } from "../../../schemas/sauceCreateSchema";
import Button from "../../../common/button/button";

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
            <Button type="button" variant="secondary" size="sm" onClick={() => onRemove(index)}>
              Supprimer cet ingrédient
            </Button>
          ) : null}
        </div>
      ))}
      <Button type="button" variant="secondary" size="md" onClick={onAppend}>
        Ajouter un ingrédient
      </Button>
    </div>
  );
}
