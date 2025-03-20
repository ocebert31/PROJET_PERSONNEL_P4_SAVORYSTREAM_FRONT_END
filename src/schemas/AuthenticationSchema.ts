import * as yup from "yup";

export const AuthenticationSchema = (isLoginPage: boolean) => yup.object({
  email: yup
    .string()
    .email("L'email est invalide") 
    .required("L'email est requis"), 

  password: yup
    .string()
    .required("Mot de passe requis")
    .min(6, "Au moins 6 caractères"),

  confirmPassword: yup
    .string()
    .when(["password"], ([password], schema) => {
      if (password && password.length > 0 && !isLoginPage) {
        return schema
          .oneOf([yup.ref("password")], "Les mots de passe doivent correspondre")
          .required("Confirmation requise");
      } else {
        return schema.notRequired();
      }
    }),
});
