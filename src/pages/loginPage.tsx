import InputFieldForm from "../common/fields/inputFieldForm";
import FormLiveFeedback from "../common/fields/formLiveFeedback";
import RequiredFieldsHint from "../common/fields/requiredFieldsHint";
import AuthCard from "../components/Auth/AuthCard";
import AuthPageLayout from "../components/Auth/AuthPageLayout";
import { useAuth } from "../context/authContext";
import { useToast } from "../hooks/useToast";
import { useAuthentication } from "../hooks/useAuthentication";
import { postLogin } from "../services/users/authentication";
import type { LoginFormData } from "../types/user";
import { Link } from "react-router-dom";
import Button from "../common/button/button";

function LoginPage() {
  const { refreshUser } = useAuth();
  const { register, handleSubmit, formState: { errors, touchedFields, isValid }, reset } = useAuthentication(true);
  const { showSuccess, showError } = useToast();
  const touchedKeys = Object.keys(touchedFields);
  const touchedCount = touchedKeys.length;
  const touchedErrorCount = touchedKeys.filter((key) => Boolean(errors[key as keyof typeof errors])).length;

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
          <RequiredFieldsHint />
          <FormLiveFeedback touchedCount={touchedCount} touchedErrorCount={touchedErrorCount} isValid={isValid} />
          <InputFieldForm label="Email" name="email" htmlFor="email" id="email" register={register} errors={errors} type="email" 
            autoComplete="email" inputMode="email" additionalContent={<p className="text-xs text-muted">Renseignez un email ou un téléphone.</p>}/>
          <InputFieldForm label="Téléphone" name="phoneNumber" htmlFor="phoneNumber" id="phoneNumber" register={register} errors={errors} type="tel" autoComplete="tel" inputMode="tel" />
          <InputFieldForm label="Mot de passe" name="password" htmlFor="password" id="password" register={register} errors={errors} type="password" required autoComplete="current-password" />
          <Button type="submit" variant="primary" fullWidth>
            Se connecter
          </Button>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}

export default LoginPage;
