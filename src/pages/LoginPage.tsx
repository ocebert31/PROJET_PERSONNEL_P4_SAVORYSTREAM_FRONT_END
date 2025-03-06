import InputFieldForm from "../common/InputFieldForm"
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
        <InputFieldForm label="Nom" name="email" htmlFor="email" id="email" register={register} errors={errors} type="text"/>
        <InputFieldForm label="Mot de passe" name="password" htmlFor="password" id="password" register={register} errors={errors} type="password"/>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default LoginPage;
