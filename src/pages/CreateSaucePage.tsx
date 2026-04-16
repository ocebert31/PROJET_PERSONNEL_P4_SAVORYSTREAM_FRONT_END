import { useNavigate } from "react-router-dom";
import { useFieldArray } from "react-hook-form";
import InputFieldForm from "../common/Fields/InputFieldForm";
import FormLiveFeedback from "../common/Fields/FormLiveFeedback";
import RequiredFieldsHint from "../common/Fields/RequiredFieldsHint";
import { FormSection } from "../components/Dashboard/Sauce/FormSection";
import { SauceIdentityFields } from "../components/Dashboard/Sauce/SauceIdentityFields";
import { ConditioningFieldsSection } from "../components/Dashboard/Sauce/ConditioningFieldsSection";
import { IngredientFieldsSection } from "../components/Dashboard/Sauce/IngredientFieldsSection";
import { useCreateSauceForm } from "../hooks/useCreateSauceForm";
import { useToast } from "../hooks/useToast";
import { useGetSauceCategories } from "../hooks/useGetSauceCategories";
import { createSauce } from "../services/sauces/sauceService";
import { ApiError } from "../services/apiRequest/apiError";
import { buildSauceCreatePayload } from "../mappers/buildSauceCreatePayload";

function CreateSaucePage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { control, register, handleSubmit, formState: { errors, touchedFields, isSubmitting, isValid } } = useCreateSauceForm();
  const { error: categoriesError, selectOptions, categoriesBlocked } = useGetSauceCategories();
  const { fields: conditioningFields,append: appendConditioning, remove: removeConditioning } = useFieldArray({ control, name: "conditionings" });
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({ control, name: "ingredients" });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await createSauce(buildSauceCreatePayload(values));
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
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Administration</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">Nouvelle sauce</h1>
      <p className="mt-3 text-sm text-muted">Renseignez les informations produit.</p>
      <RequiredFieldsHint className="mt-1 text-xs text-muted" />
      <p className="mt-1 text-xs text-muted">
        Après validation, vous serez redirigé vers la fiche produit créée.
      </p>
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
              <p className="text-xs font-medium text-rose-700" role="alert">Rechargez la page après connexion admin.</p>
            ) : null
          }/>
        <FormSection title="Stock" description="Indiquez la quantité actuellement disponible.">
          <div className="mt-4 max-w-xs">
            <InputFieldForm label="Quantité en stock" name="stock_quantity" htmlFor="stock-qty" id="stock-qty" register={register} errors={errors} type="number" required min={0} step={1} inputMode="numeric" valueAsNumber/>
          </div>
        </FormSection>
        <FormSection title="Conditionnements" description="Ajoutez un ou plusieurs formats (volume + prix).">
          <ConditioningFieldsSection
            register={register}
            errors={errors}
            fields={conditioningFields}
            onAppend={() => appendConditioning({ volume: "", price: "" })}
            onRemove={removeConditioning}
          />
        </FormSection>
        <FormSection title="Ingrédients" description="Ajoutez un ou plusieurs ingrédients avec leur quantité.">
          <IngredientFieldsSection
            register={register}
            errors={errors}
            fields={ingredientFields}
            onAppend={() => appendIngredient({ name: "", quantity: "" })}
            onRemove={removeIngredient}
          />
        </FormSection>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button type="submit" disabled={submitDisabled} className="min-h-11 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Enregistrement…" : "Créer la sauce"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="min-h-11 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground/90 transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSaucePage;
