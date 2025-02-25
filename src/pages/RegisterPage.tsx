import InputField from "../common/Users/Emailinput"
import PasswordField from "../common/Users/PasswordInput";
import { useFormSchema } from "../hooks/useFormSchema";
import { postRegister } from "../services/authenticationService";
import { RegisterFormData } from "../types/User";

function RegisterPage () {
  const { register, handleSubmit, formState: { errors }} = useFormSchema();

  const onSubmit = async (data: RegisterFormData) => {
    await postRegister(data)
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField label="Nom" name="email" htmlFor="email" id="email" register={register} error={errors.email?.message} />
        <PasswordField label="Mot de passe" name="password" htmlFor="password" id="password" register={register} data-testid="password-input" error={errors.password?.message} />
        <PasswordField label="Confirmer le mot de passe" name="confirmPassword" htmlFor="confirmPassword" id="confirmPassword" data-testid="confirmPassword-input" register={register} error={errors.confirmPassword?.message} />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegisterPage;
