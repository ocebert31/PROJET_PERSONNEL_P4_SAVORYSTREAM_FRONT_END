import InputFieldForm from "../common/InputFieldForm";
import AuthCard from "../components/auth/AuthCard";
import AuthPageLayout from "../components/auth/AuthPageLayout";
import { useAuthenticationSchema } from "../hooks/useAuthenticationSchema";
import { postLogin } from "../services/authenticationService";
import { FormData } from "../types/User";
import { Link } from "react-router-dom";

function LoginPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useAuthenticationSchema(true);

  const onSubmit = async (data: FormData) => {
    await postLogin(data);
    reset();
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
