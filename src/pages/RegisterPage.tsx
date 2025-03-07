import InputFieldForm from "../common/InputFieldForm";
import { useFormSchema } from "../hooks/useFormSchema";
import { postRegister } from "../services/authenticationService";
import { RegisterFormData } from "../types/User";

function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useFormSchema(false);

  const onSubmit = async (data: RegisterFormData) => {
    await postRegister(data);
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-primary text-center mb-8">Inscription</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputFieldForm label="Nom" name="email" htmlFor="email" id="email" register={register} errors={errors} type="text"/>
          <InputFieldForm label="Mot de passe" name="password" htmlFor="password" id="password" register={register} errors={errors} type="password" />
          <InputFieldForm label="Confirmer le mot de passe" name="confirmPassword" htmlFor="confirmPassword" id="confirmPassword" register={register} errors={errors} type="password"/>
          <div className="flex items-center justify-between">
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-300">
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
