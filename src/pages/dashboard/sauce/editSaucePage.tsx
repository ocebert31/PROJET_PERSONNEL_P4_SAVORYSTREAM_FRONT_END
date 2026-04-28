import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../../common/button/button";
import InputFieldForm from "../../../common/fields/inputFieldForm";
import RequiredFieldsHint from "../../../common/fields/requiredFieldsHint";
import { FormSection } from "../../../components/Dashboard/Sauce/FormSection";
import { ConditioningFieldsSection } from "../../../components/Dashboard/Sauce/ConditioningFieldsSection";
import { IngredientFieldsSection } from "../../../components/Dashboard/Sauce/IngredientFieldsSection";
import { SauceIdentityFields } from "../../../components/Dashboard/Sauce/SauceIdentityFields";
import { useSauceDetailQuery } from "../../../hooks/useSauceDetail";
import { useEditSauceConditionings } from "../../../hooks/useEditSauceConditionings";
import { useEditSauceIngredients } from "../../../hooks/useEditSauceIngredients";
import { useToast } from "../../../hooks/useToast";
import { useGetSauceCategories } from "../../../hooks/useGetSauceCategories";
import type { SauceConditioningListFormSlice, SauceCreateFormValues, SauceIngredientListFormSlice } from "../../../schemas/sauceCreateSchema";
import { SauceEditFormSchema, buildSauceEditFormDefaultsFromApi, emptySauceEditFormValues, type SauceEditFormValues } from "../../../schemas/sauceUpdateSchema";
import { buildSauceEditFormData } from "../../../mappers/buildSauceEditFormData";
import { updateSauce } from "../../../services/sauces/sauceService";
import { isVersionConflictApiError } from "../../../services/apiRequest/apiError";
import AdminFormPageLayout from "../../../common/layout/AdminFormPageLayout";
import { toErrorMessage } from "../../../utils/errorMessage";

const VERSION_CONFLICT_USER_MESSAGE = "Cette fiche a été modifiée ailleurs ou la version côté serveur ne correspond plus. Rechargez les données pour repartir de l'état actuel du serveur.";

function EditSaucePage() {
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();
  const sauceId = routeId?.trim() ?? "";
  const { apiSauce, isLoading, error, retry } = useSauceDetailQuery(routeId);
  const { showSuccess, showError } = useToast();
  const { error: categoriesError, selectOptions, categoriesBlocked } = useGetSauceCategories();
  const [versionConflictVisible, setVersionConflictVisible] = useState(false);
  const [isSavingEntireSauce, setIsSavingEntireSauce] = useState(false);

  const notifyMutationError = useCallback(
    (e: unknown, fallbackMessage: string) => {
      if (isVersionConflictApiError(e)) {
        setVersionConflictVisible(true);
        return;
      }
      showError(toErrorMessage(e, fallbackMessage));
    },
    [showError],
  );

  const reloadServerData = useCallback(() => {
    setVersionConflictVisible(false);
    retry();
  }, [retry]);

  const { control, register, reset, getValues, trigger, formState } = useForm<SauceEditFormValues>({
    resolver: yupResolver(SauceEditFormSchema()),
    defaultValues: emptySauceEditFormValues,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const {fields: conditioningFields, append: appendConditioning, remove: removeConditioning } = useFieldArray({ control, name: "conditionings" });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({ control, name: "ingredients" });
  const { deleteConditioningRow, applyConditioningDeletes, syncConditioningRows, resetPendingConditioningDeletes } = useEditSauceConditionings({sauceId, getValues, removeConditioning });
  const { deleteIngredientRow, applyIngredientDeletes, syncIngredientRows, resetPendingIngredientDeletes } = useEditSauceIngredients({ sauceId, getValues, removeIngredient });

  useEffect(() => {
    if (!apiSauce) return;
    reset(buildSauceEditFormDefaultsFromApi(apiSauce));
    resetPendingConditioningDeletes();
    resetPendingIngredientDeletes();
  }, [apiSauce, reset, resetPendingConditioningDeletes, resetPendingIngredientDeletes]);

  const saveSauceEdition = useCallback(async () => {
    if (!sauceId) return;
    const valid = await trigger();
    if (!valid) return;
    setIsSavingEntireSauce(true);
    try {
      const values = getValues();
      await updateSauce(sauceId, buildSauceEditFormData(values));

      await applyConditioningDeletes();
      await syncConditioningRows(values.conditionings);
      await applyIngredientDeletes();
      await syncIngredientRows(values.ingredients);

      showSuccess("Sauce mise à jour.");
      navigate(`/sauce/${sauceId}`, { replace: true });
    } catch (e) {
      notifyMutationError(e, "Enregistrement impossible.");
    } finally {
      setIsSavingEntireSauce(false);
    }
  }, [ applyConditioningDeletes, applyIngredientDeletes,
    getValues, navigate, notifyMutationError,
    sauceId, showSuccess, syncConditioningRows,
    syncIngredientRows, trigger ]);

  if (isLoading) {
    return (
      <AdminFormPageLayout title="Edition de sauce">
        <div className="min-h-[24rem]">
          <p className="text-body-sm mt-4 text-muted" role="status">
            Chargement de la sauce...
          </p>
        </div>
      </AdminFormPageLayout>
    );
  }

  if (error) {
    return (
      <AdminFormPageLayout title="Edition de sauce">
        <div className="min-h-[24rem]">
          <p className="text-body-sm mt-4 text-destructive">{error}</p>
          <Button type="button" variant="secondary" className="mt-4" onClick={retry}>
            Reessayer
          </Button>
        </div>
      </AdminFormPageLayout>
    );
  }

  if (!apiSauce) {
    return (
      <AdminFormPageLayout title="Edition de sauce">
        <div className="min-h-[24rem]">
          <p className="text-body-sm mt-4 text-muted">Sauce introuvable.</p>
        </div>
      </AdminFormPageLayout>
    );
  }

  const identityRegister = register as unknown as UseFormRegister<SauceCreateFormValues>;
  const identityErrors = formState.errors as unknown as FieldErrors<SauceCreateFormValues>;
  const submitDisabled = isSavingEntireSauce || categoriesBlocked;
  const listActionsDisabled = isSavingEntireSauce;

  return (
    <AdminFormPageLayout
      title="Edition de sauce"
      description="Modifiez la fiche, les conditionnements et les ingrédients, puis enregistrez tout avec le bouton « Enregistrer la sauce ». Les suppressions sont prises en compte au moment de cet enregistrement global."
      headerContent={
        <>
          <RequiredFieldsHint className="text-caption mt-2 text-muted" />
          {versionConflictVisible ? (
            <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4" role="alert" aria-live="assertive">
              <p className="text-body-sm text-foreground">{VERSION_CONFLICT_USER_MESSAGE}</p>
              <Button type="button" variant="secondary" className="mt-3" onClick={reloadServerData}>
                Recharger les données serveur
              </Button>
            </div>
          ) : null}
        </>
      }
    >
      <form onSubmit={(event) => { event.preventDefault() }} className="mt-10 space-y-6" noValidate>
        <fieldset disabled={isSavingEntireSauce} className="min-w-0 space-y-6 border-0 p-0">
          <FormSection title="Fiche sauce" description="Informations affichées sur la fiche produit.">
            <div className="mt-4 space-y-6">
              <SauceIdentityFields register={identityRegister} errors={identityErrors} imageOptional />
              <InputFieldForm label="Sauce disponible à la vente" name="is_available" htmlFor="sauce-available" id="sauce-available" register={register} errors={formState.errors} type="checkbox" required/>
              <InputFieldForm label="Catégorie" name="category_id" htmlFor="sauce-category" id="sauce-category" register={register} errors={formState.errors} type="select" required disabled={categoriesBlocked} placeholderOption={{ value: "", label: "— Choisir —" }} options={selectOptions} additionalContent={
                  categoriesError ? (
                    <p className="text-caption font-medium text-destructive" role="alert">
                      Rechargez la page après connexion admin.
                    </p> ) : null}/>
            </div>
          </FormSection>
          <FormSection title="Stock" description="Quantité actuellement disponible.">
            <div className="mt-4 max-w-xs">
              <InputFieldForm label="Quantité en stock" name="stock_quantity" htmlFor="stock-qty" id="stock-qty" register={register} errors={formState.errors} type="number" required min={0} step={1} inputMode="numeric" valueAsNumber/>
            </div>
          </FormSection>
          <FormSection title="Conditionnements" description="Ajoutez ou modifiez des formats ; les changements sont appliqués lors de l’enregistrement global.">
            <ConditioningFieldsSection
              register={register as unknown as UseFormRegister<SauceConditioningListFormSlice>} 
              errors={formState.errors as unknown as FieldErrors<SauceConditioningListFormSlice>}
              fields={conditioningFields as FieldArrayWithId<SauceConditioningListFormSlice, "conditionings", "id">[]}
              mode="edit"
              onAppend={() => appendConditioning({ volume: "", price: "" })}
              onRemove={removeConditioning}
              onDeletePersistedRow={deleteConditioningRow}
              listActionsDisabled={listActionsDisabled}
              deletingRowIndex={null}
            />
          </FormSection>
          <FormSection title="Ingrédients" description="Ajoutez ou modifiez la liste ; enregistrez avec le bouton ci-dessous.">
            <IngredientFieldsSection
              register={register as unknown as UseFormRegister<SauceIngredientListFormSlice>}
              errors={formState.errors as unknown as FieldErrors<SauceIngredientListFormSlice>}
              fields={ingredientFields as FieldArrayWithId<SauceIngredientListFormSlice, "ingredients", "id">[]}
              mode="edit"
              onAppend={() => appendIngredient({ name: "", quantity: "" })}
              onRemove={removeIngredient}
              onDeletePersistedRow={deleteIngredientRow}
              listActionsDisabled={listActionsDisabled}
              deletingRowIndex={null}
            />
          </FormSection>
        </fieldset>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button type="button" variant="primary" size="lg" disabled={submitDisabled} onClick={() => void saveSauceEdition()}>
            {isSavingEntireSauce ? "Enregistrement…" : "Enregistrer la sauce"}
          </Button>
        </div>
      </form>
    </AdminFormPageLayout>
  );
}

export default EditSaucePage;
