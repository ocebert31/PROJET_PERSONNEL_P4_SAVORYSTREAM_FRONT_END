import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthenticationSchema } from "../schemas/AuthenticationSchema";
import type { LoginFormData, RegisterFormData } from "../types/User";

export function useAuthentication(isLoginPage: boolean): ReturnType<typeof useForm<LoginFormData | RegisterFormData>> {
  const schema = AuthenticationSchema(isLoginPage);
  return useForm<LoginFormData | RegisterFormData>({
    resolver: yupResolver(schema),
  });
}
