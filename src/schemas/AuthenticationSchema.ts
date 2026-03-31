import * as yup from "yup";

const emailField = yup
  .string()
  .email("L'email est invalide")
  .optional();

const phoneField = yup
  .string()
  .optional()
  .matches(/^\d{10}$/, { message: "10 chiffres (ex. 0612345678)", excludeEmptyString: true });

const loginSchema = yup.object({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  phoneNumber: phoneField,
  email: emailField,
  password: yup
    .string()
    .required("Mot de passe requis")
    .min(6, "Au moins 6 caractères"),
  confirmPassword: yup.string().optional(),
}).test("email-or-phone", "Email ou numéro de téléphone requis.", function (value) {
  const email = value?.email?.trim() || "";
  const phone = value?.phoneNumber?.trim() || "";

  if (!email && !phone) {
    return this.createError({ path: "email", message: "Email ou numéro de téléphone requis." });
  }
  if (email && phone) {
    return this.createError({ path: "email", message: "Renseignez uniquement un email ou un numéro de téléphone, pas les deux." });
  }
  return true;
});

const registerSchema = yup.object({
  firstName: yup
    .string()
    .required("Le prénom est requis")
    .max(50, "50 caractères maximum"),
  lastName: yup
    .string()
    .required("Le nom est requis")
    .max(50, "50 caractères maximum"),
  phoneNumber: yup
    .string()
    .required("Le numéro est requis")
    .matches(/^\d{10}$/, "10 chiffres (ex. 0612345678)"),
  email: emailField.required("L'email est requis"),
  password: yup
    .string()
    .required("Mot de passe requis")
    .min(8, "Au moins 8 caractères"),
  confirmPassword: yup
    .string()
    .when(["password"], ([password], schema) => {
      if (password && String(password).length > 0) {
        return schema
          .oneOf([yup.ref("password")], "Les mots de passe doivent correspondre")
          .required("Confirmation requise");
      }
      return schema.notRequired();
    }),
});

export const AuthenticationSchema = (isLoginPage: boolean) =>
  isLoginPage ? loginSchema : registerSchema;
