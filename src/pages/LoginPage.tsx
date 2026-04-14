import InputFieldForm from "../common/Fields/InputFieldForm";
import AuthCard from "../components/auth/AuthCard";
import AuthPageLayout from "../components/auth/AuthPageLayout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { useAuthentication } from "../hooks/useAuthentication";
import { postLogin } from "../services/users/authentication";
import type { LoginFormData } from "../types/User";
import { Link } from "react-router-dom";

function LoginPage() {
  const { refreshUser } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useAuthentication(true);
  const { showSuccess, showError } = useToast();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const payload: LoginFormData = {
        password: data.password,
        ...(data.email?.trim() ? { email: data.email.trim() } : {}),
        ...(data.phoneNumber?.trim() ? { phoneNumber: data.phoneNumber.trim() } : {}),
      };
      const result = await postLogin(payload);
      await refreshUser();
      reset();
      showSuccess(result.message?.trim() || "Connexion réussie.");
    } catch (e) {
      showError(e instanceof Error ? e.message : "Une erreur est survenue.");
    }
  };

  return (
    <AuthPageLayout variant="primary">
      <AuthCard eyebrow="Bienvenue" title="Connexion" subtitle="Accédez à vos commandes et à vos sauces préférées."
        footer={
          <p className="mt-8 text-center text-sm text-muted">
            Pas encore de compte ? <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">Créer un compte</Link>
          </p>}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <InputFieldForm label="Email" name="email" htmlFor="email" id="email" register={register} errors={errors} type="text" />
          <InputFieldForm label="Téléphone" name="phoneNumber" htmlFor="phoneNumber" id="phoneNumber" register={register} errors={errors} type="text" />
          <InputFieldForm label="Mot de passe" name="password" htmlFor="password" id="password" register={register} errors={errors} type="password" />
          <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-hover">
            Se connecter
          </button>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}

export default LoginPage;
