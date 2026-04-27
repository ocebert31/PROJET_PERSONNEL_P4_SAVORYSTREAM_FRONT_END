import { useForm } from "react-hook-form";
import Button from "../../../common/button/button";
import InputFieldForm from "../../../common/fields/inputFieldForm";
import { ApiError } from "../../../services/apiRequest/apiError";
import { createAdminCategory } from "../../../services/sauces/category/categoryService";
import { useToast } from "../../../hooks/useToast";
import type { CreateCategoryFormValues, CreateCategoryPageProps } from "../../../types/sauceCategory";

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Création de catégorie impossible.";
}

function CreateCategoryPage({ onCreated }: CreateCategoryPageProps) {
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
      await onCreated?.();
    } catch (error) {
      showError(toErrorMessage(error));
    }
  });

  return (
    <form className="mt-8 max-w-xl space-y-4" onSubmit={onSubmit} noValidate>
      <h2 className="text-label text-foreground">Nouvelle catégorie</h2>
      <p className="text-body-sm text-muted">Ajoutez une nouvelle catégorie pour organiser les sauces.</p>
      <InputFieldForm<CreateCategoryFormValues>
        label="Nom de la catégorie"
        name="name"
        htmlFor="category-name"
        id="category-name"
        register={register}
        errors={errors}
        type="text"
        disabled={isSubmitting}
        autoComplete="off"
      />
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Ajout..." : "Ajouter la catégorie"}
      </Button>
    </form>
  );
}

export default CreateCategoryPage;
