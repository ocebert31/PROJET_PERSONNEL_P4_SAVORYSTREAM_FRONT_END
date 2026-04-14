import InputFieldForm from "../common/Fields/InputFieldForm";
import AuthCard from "../components/auth/AuthCard";
import AuthPageLayout from "../components/auth/AuthPageLayout";
import { useToast } from "../hooks/useToast";
import { useAuthentication } from "../hooks/useAuthentication";
import { postRegister } from "../services/users/authentication";
import { RegisterFormData } from "../types/User";
import { Link } from "react-router-dom";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useAuthentication(false);
  const { showSuccess, showError } = useToast();

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
          <InputFieldForm label="Prénom" name="firstName" htmlFor="firstName" id="firstName" register={register} errors={errors} type="text" />
          <InputFieldForm label="Nom" name="lastName" htmlFor="lastName" id="lastName" register={register} errors={errors} type="text" />
          <InputFieldForm label="Email" name="email" htmlFor="email" id="email" register={register} errors={errors} type="text" />
          <InputFieldForm label="Téléphone" name="phoneNumber" htmlFor="phoneNumber" id="phoneNumber" register={register} errors={errors} type="text" />
          <InputFieldForm label="Mot de passe" name="password" htmlFor="password" id="password" register={register} errors={errors} type="password" />
          <InputFieldForm label="Confirmer le mot de passe" name="confirmPassword" htmlFor="confirmPassword" id="confirmPassword" register={register} errors={errors} type="password" />
          <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover">
            S&apos;inscrire
          </button>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}

export default RegisterPage;
