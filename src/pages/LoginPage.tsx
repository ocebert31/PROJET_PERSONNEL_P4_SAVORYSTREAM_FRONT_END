import InputFieldForm from "../common/InputFieldForm";
import { useAuthenticationSchema } from "../hooks/useAuthenticationSchema";
import { postLogin } from "../services/authenticationService";
import { FormData } from "../types/User";

function LoginPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useAuthenticationSchema(true);

  const onSubmit = async (data: FormData) => {
    await postLogin(data);
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-primary text-center mb-8">Connexion</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputFieldForm label="Nom" name="email" htmlFor="email" id="email" register={register} errors={errors} type="text"/>
          <InputFieldForm label="Mot de passe" name="password" htmlFor="password" id="password" register={register} errors={errors} type="password"/>
          <div className="flex items-center justify-between">
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-300">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
