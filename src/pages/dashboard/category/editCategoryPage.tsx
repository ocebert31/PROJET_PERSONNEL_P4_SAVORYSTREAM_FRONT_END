import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../common/button/button";
import InputFieldForm from "../../../common/fields/inputFieldForm";
import { fetchAdminCategoryById } from "../../../services/sauces/category/categoryService";
import { useToast } from "../../../hooks/useToast";
import { useEditCategory } from "../../../hooks/useEditCategory";
import AdminFormPageLayout from "../../../common/layout/AdminFormPageLayout";
import type { CreateCategoryFormValues } from "../../../types/sauceCategory";
import { toErrorMessage } from "../../../utils/errorMessage";
import { useAsyncStatus } from "../../../hooks/useAsyncStatus";

function EditCategoryPage() {
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();
  const categoryId = routeId?.trim() ?? "";
  const { showSuccess, showError } = useToast();
  const { editCategoryById, editingCategoryId, editErrorMessage, clearEditError } = useEditCategory();
  const { errorMessage: loadErrorMessage, setErrorMessage, startLoading, setSuccess, setError, isBusy, isError } = useAsyncStatus("idle");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCategoryFormValues>({
    defaultValues: { name: "" },
  });

  const loadCategory = useCallback(async () => {
    if (!categoryId) {
      setError("Catégorie introuvable.");
      return;
    }

    startLoading(false);
    setErrorMessage("");
    clearEditError();
    try {
      const result = await fetchAdminCategoryById(categoryId);
      reset({ name: result.category.name });
      setSuccess();
    } catch (error) {
      setError(toErrorMessage(error, "Impossible de charger la catégorie."));
    }
  }, [categoryId, clearEditError, reset, setError, setErrorMessage, setSuccess, startLoading]);

  useEffect(() => {
    void loadCategory();
  }, [loadCategory]);

  const onSubmit = handleSubmit(async ({ name }) => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      showError("Le nom de catégorie est requis.");
      return;
    }

    const updatedCategory = await editCategoryById(categoryId, normalizedName);
    if (!updatedCategory) return;

    showSuccess("Catégorie mise à jour.");
    navigate("/dashboard/categories", { replace: true });
  });

  if (isBusy) {
    return (
      <AdminFormPageLayout title="Edition de catégorie">
        <p className="text-body-sm mt-4 text-muted" role="status">
          Chargement de la catégorie...
        </p>
      </AdminFormPageLayout>
    );
  }

  if (isError) {
    return (
      <AdminFormPageLayout title="Edition de catégorie">
        <p className="text-body-sm mt-4 text-destructive">{loadErrorMessage}</p>
        <Button type="button" variant="secondary" className="mt-4" onClick={() => void loadCategory()}>
          Reessayer
        </Button>
      </AdminFormPageLayout>
    );
  }

  return (
    <AdminFormPageLayout title="Edition de catégorie" description="Mettez à jour le nom puis enregistrez les changements.">
      {editErrorMessage ? (
        <p className="text-body-sm mt-4 text-destructive">{editErrorMessage}</p>
      ) : null}
      <form className="mt-8 max-w-xl space-y-4" onSubmit={onSubmit} noValidate>
        <InputFieldForm<CreateCategoryFormValues>
          label="Nom de la catégorie"
          name="name"
          htmlFor="category-name"
          id="category-name"
          register={register}
          errors={errors}
          type="text"
          disabled={editingCategoryId === categoryId}
          autoComplete="off"
        />
        <Button type="submit" variant="primary" disabled={editingCategoryId === categoryId}>
          {editingCategoryId === categoryId ? "Enregistrement..." : "Enregistrer la catégorie"}
        </Button>
      </form>
    </AdminFormPageLayout>
  );
}

export default EditCategoryPage;
