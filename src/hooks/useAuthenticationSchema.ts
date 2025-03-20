import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthenticationSchema } from "../schemas/AuthenticationSchema";

export const useAuthenticationSchema = (isLoginPage: boolean) => {
  const schema = AuthenticationSchema(isLoginPage); 

  return useForm({
    resolver: yupResolver(schema),
  });
};
