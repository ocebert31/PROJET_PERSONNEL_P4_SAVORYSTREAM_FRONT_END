import InputField from "../common/Users/Emailinput"
import PasswordField from "../common/Users/PasswordInput";
import { useFormSchema } from "../hooks/useFormSchema";
import { postLogin } from "../services/authenticationService";
import { FormData } from "../types/User";

function LoginPage () {
  const { register, handleSubmit, formState: { errors }, reset} = useFormSchema(true);

  const onSubmit = async (data: FormData) => {
    await postLogin(data)
    reset();
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField label="Nom" name="email" htmlFor="email" id="email" register={register} error={errors.email?.message} />
        <PasswordField label="Mot de passe" name="password" htmlFor="password" id="password" register={register} data-testid="password-input" error={errors.password?.message} />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default LoginPage;
