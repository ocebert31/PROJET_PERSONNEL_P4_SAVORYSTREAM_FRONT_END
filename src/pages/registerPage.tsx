import InputFieldForm from "../common/fields/inputFieldForm";
import FormLiveFeedback from "../common/fields/formLiveFeedback";
import RequiredFieldsHint from "../common/fields/requiredFieldsHint";
import AuthCard from "../components/Auth/AuthCard";
import AuthPageLayout from "../components/Auth/AuthPageLayout";
import { useToast } from "../hooks/useToast";
import { useAuthentication } from "../hooks/useAuthentication";
import { postRegister } from "../services/users/authentication";
import { RegisterFormData } from "../types/user";
import { Link } from "react-router-dom";
import Button from "@/common/button/button";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors, touchedFields, isValid }, reset } = useAuthentication(false);
  const { showSuccess, showError } = useToast();
  const touchedKeys = Object.keys(touchedFields);
  const touchedCount = touchedKeys.length;
  const touchedErrorCount = touchedKeys.filter((key) => Boolean(errors[key as keyof typeof errors])).length;

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await postRegister(data);
      reset();
      showSuccess(result.message.trim() || "Inscription réussie.");
    } catch (e) {
      showError(e instanceof Error ? e.message : "Une erreur est survenue.");
    }
  };

  return (
    <AuthPageLayout variant="secondary">
      <AuthCard eyebrow="Rejoignez-nous" title="Inscription" subtitle="Créez votre compte pour commander et suivre vos livraisons."
        footer={
          <p className="mt-8 text-center text-sm text-muted">
            Déjà inscrit ? <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">Se connecter</Link>
          </p>}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <RequiredFieldsHint />
          <FormLiveFeedback touchedCount={touchedCount} touchedErrorCount={touchedErrorCount} isValid={isValid} />
          <InputFieldForm label="Prénom" name="firstName" htmlFor="firstName" id="firstName" register={register} errors={errors} type="text" required autoComplete="given-name" />
          <InputFieldForm label="Nom" name="lastName" htmlFor="lastName" id="lastName" register={register} errors={errors} type="text" required autoComplete="family-name" />
          <InputFieldForm label="Email" name="email" htmlFor="email" id="email" register={register} errors={errors} type="email" required autoComplete="email" inputMode="email" />
          <InputFieldForm label="Téléphone" name="phoneNumber" htmlFor="phoneNumber" id="phoneNumber" register={register} errors={errors} type="tel" required autoComplete="tel" inputMode="tel" />
          <InputFieldForm label="Mot de passe" name="password" htmlFor="password" id="password" register={register} errors={errors} type="password" required autoComplete="new-password" />
          <InputFieldForm label="Confirmer le mot de passe" name="confirmPassword" htmlFor="confirmPassword" id="confirmPassword" register={register} errors={errors} type="password" required autoComplete="new-password" />
          <Button type="submit" variant="primary" fullWidth>
            S&apos;inscrire
          </Button>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}

export default RegisterPage;
