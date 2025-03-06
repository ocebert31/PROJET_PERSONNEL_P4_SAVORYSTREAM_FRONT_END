import InputFieldForm from "../common/InputFieldForm"
import { useFormSchema } from "../hooks/useFormSchema";
import { postRegister } from "../services/authenticationService";
import { RegisterFormData } from "../types/User";

function RegisterPage () {
  const { register, handleSubmit, formState: { errors }, reset} = useFormSchema(false);

  const onSubmit = async (data: RegisterFormData) => {
    await postRegister(data)
    reset();
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputFieldForm label="Nom" name="email" htmlFor="email" id="email" register={register} errors={errors} type="text"/>
        <InputFieldForm label="Mot de passe" name="password" htmlFor="password" id="password" register={register} errors={errors} type="password"/>
        <InputFieldForm label="Confirmer le mot de passe" name="confirmPassword" htmlFor="confirmPassword" id="confirmPassword" register={register} errors={errors} type="password"/>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegisterPage;
