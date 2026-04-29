import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../../common/button/button";
import InputFieldForm from "../../../common/fields/inputFieldForm";
import { createAdminCategory } from "../../../services/sauces/category/categoryService";
import { useToast } from "../../../hooks/useToast";
import AdminFormPageLayout from "../../../common/layout/adminFormPageLayout";
import type { CreateCategoryFormValues, CreateCategoryPageProps } from "../../../types/sauceCategory";
import { toErrorMessage } from "../../../utils/errorMessage";

function CreateCategoryPage({ onCreated }: CreateCategoryPageProps) {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateCategoryFormValues>({
    defaultValues: { name: "" },
  });
  const { showError, showSuccess } = useToast();

  const onSubmit = handleSubmit(async ({ name }) => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      showError("Le nom de catégorie est requis.");
      return;
    }
    try {
      const result = await createAdminCategory(normalizedName);
      showSuccess(result.message?.trim() || "Catégorie créée.");
      reset({ name: "" });
      if (onCreated) {
        await onCreated();
      } else {
        navigate("/dashboard/categories", { replace: true });
      }
    } catch (error) {
      showError(toErrorMessage(error, "Création de catégorie impossible."));
    }
  });

  return (
    <AdminFormPageLayout title="Nouvelle catégorie" description={
      <>
        <p>Ajoutez une catégorie pour mieux organiser votre catalogue de sauces.</p>
        <p className="text-caption mt-1">Après validation, vous reviendrez sur la liste des catégories.</p>
      </>
    }>
      <form className="mt-10 max-w-xl space-y-6" onSubmit={onSubmit} noValidate>
        <InputFieldForm<CreateCategoryFormValues> label="Nom de la catégorie" name="name" htmlFor="category-name" id="category-name" register={register} errors={errors} type="text" disabled={isSubmitting} autoComplete="off"/>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Ajout..." : "Ajouter la catégorie"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Annuler
          </Button>
        </div>
      </form>
    </AdminFormPageLayout>
  );
}

export default CreateCategoryPage;
