import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthenticationSchema } from "../schemas/AuthenticationSchema";
import type { RegisterFormData } from "../types/User";

export const useAuthenticationSchema = (isLoginPage: boolean) => {
  const schema = AuthenticationSchema(isLoginPage);

  return useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });
};
