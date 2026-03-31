import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthenticationSchema } from "../schemas/AuthenticationSchema";
import type { LoginFormData, RegisterFormData } from "../types/User";

export function useAuthenticationSchema(isLoginPage: true): ReturnType<typeof useForm<LoginFormData>>;
export function useAuthenticationSchema(isLoginPage: false): ReturnType<typeof useForm<RegisterFormData>>;
export function useAuthenticationSchema(isLoginPage: boolean) {
  const schema = AuthenticationSchema(isLoginPage);
  return useForm<LoginFormData | RegisterFormData>({
    resolver: yupResolver(schema),
  });
}
