import { useNavigate } from "react-router-dom";
import type { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import InputFieldForm from "../../../common/fields/inputFieldForm";
import FormLiveFeedback from "../../../common/fields/formLiveFeedback";
import RequiredFieldsHint from "../../../common/fields/requiredFieldsHint";
import { FormSection } from "../../../components/Dashboard/Sauce/FormSection";
import { SauceIdentityFields } from "../../../components/Dashboard/Sauce/SauceIdentityFields";
import { ConditioningFieldsSection } from "../../../components/Dashboard/Sauce/ConditioningFieldsSection";
import { IngredientFieldsSection } from "../../../components/Dashboard/Sauce/IngredientFieldsSection";
import type { SauceConditioningListFormSlice, SauceIngredientListFormSlice } from "../../../schemas/sauceCreateSchema";
import { useCreateSauceForm } from "../../../hooks/useCreateSauceForm";
import { useToast } from "../../../hooks/useToast";
import { useGetSauceCategories } from "../../../hooks/useGetSauceCategories";
import { createSauce } from "../../../services/sauces/sauceService";
import { ApiError } from "../../../services/apiRequest/apiError";
import { buildSauceCreateFormData } from "../../../mappers/buildSauceCreateFormData";
import AdminFormPageLayout from "../../../common/layout/AdminFormPageLayout";
import Button from "../../../common/button/button";

function CreateSaucePage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { control, register, handleSubmit, formState: { errors, touchedFields, isSubmitting, isValid } } = useCreateSauceForm();
  const { error: categoriesError, selectOptions, categoriesBlocked } = useGetSauceCategories();
  const { fields: conditioningFields,append: appendConditioning, remove: removeConditioning } = useFieldArray({ control, name: "conditionings" });
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({ control, name: "ingredients" });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await createSauce(buildSauceCreateFormData(values));
      showSuccess(result.message?.trim() || "Sauce créée.");
      navigate(`/sauce/${result.sauce.id}`, { replace: true });
    } catch (e) {
      if (e instanceof ApiError && e.status === 422) {
        showError(e.message);
      } else {
        showError(e instanceof Error ? e.message : "Création impossible.");
      }
    }
  });

  const submitDisabled = isSubmitting || categoriesBlocked;
  const touchedKeys = Object.keys(touchedFields);
  const touchedCount = touchedKeys.length;
  const touchedErrorCount = touchedKeys.filter((key) => Boolean(errors[key as keyof typeof errors])).length;

  return (
    <AdminFormPageLayout title="Nouvelle sauce" description="Renseignez les informations produit." headerContent={
      <>
        <RequiredFieldsHint className="text-caption mt-1 text-muted" />
        <p className="text-caption mt-1 text-muted">
          Après validation, vous serez redirigé vers la fiche produit créée.
        </p>
      </>
    }>
      <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
        <p aria-live="polite" className="sr-only">
          {isSubmitting ? "Enregistrement en cours." : categoriesBlocked ? "Impossible de charger les catégories." : ""}
        </p>
        <FormLiveFeedback touchedCount={touchedCount} touchedErrorCount={touchedErrorCount} isValid={isValid} />
        <SauceIdentityFields register={register} errors={errors} />
        <InputFieldForm label="Sauce disponible à la vente" name="is_available" htmlFor="sauce-available" id="sauce-available" register={register} errors={errors} type="checkbox" required />
        <InputFieldForm label="Catégorie" name="category_id" htmlFor="sauce-category" id="sauce-category" register={register} errors={errors} type="select" required disabled={categoriesBlocked} placeholderOption={{ value: "", label: "— Choisir —" }} options={selectOptions}
          additionalContent={
            categoriesError ? (
              <p className="text-caption font-medium text-destructive" role="alert">Rechargez la page après connexion admin.</p>
            ) : null
          }/>
        <FormSection title="Stock" description="Indiquez la quantité actuellement disponible.">
          <div className="mt-4 max-w-xs">
            <InputFieldForm label="Quantité en stock" name="stock_quantity" htmlFor="stock-qty" id="stock-qty" register={register} errors={errors} type="number" required min={0} step={1} inputMode="numeric" valueAsNumber/>
          </div>
        </FormSection>
        <FormSection title="Conditionnements" description="Ajoutez un ou plusieurs formats (volume + prix).">
          <ConditioningFieldsSection
            register={register as unknown as UseFormRegister<SauceConditioningListFormSlice>}
            errors={errors as unknown as FieldErrors<SauceConditioningListFormSlice>}
            fields={conditioningFields as FieldArrayWithId<SauceConditioningListFormSlice, "conditionings", "id">[]}
            onAppend={() => appendConditioning({ volume: "", price: "" })}
            onRemove={removeConditioning}
          />
        </FormSection>
        <FormSection title="Ingrédients" description="Ajoutez un ou plusieurs ingrédients avec leur quantité.">
          <IngredientFieldsSection
            register={register as unknown as UseFormRegister<SauceIngredientListFormSlice>}
            errors={errors as unknown as FieldErrors<SauceIngredientListFormSlice>}
            fields={ingredientFields as FieldArrayWithId<SauceIngredientListFormSlice, "ingredients", "id">[]}
            onAppend={() => appendIngredient({ name: "", quantity: "" })}
            onRemove={removeIngredient}
          />
        </FormSection>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button type="submit" variant="primary" size="lg" disabled={submitDisabled}>
            {isSubmitting ? "Enregistrement…" : "Créer la sauce"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Annuler
          </Button>
        </div>
      </form>
    </AdminFormPageLayout>
  );
}

export default CreateSaucePage;
