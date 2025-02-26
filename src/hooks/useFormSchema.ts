import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../schemas/RegisterSchema";

export const useFormSchema = (isLoginPage: boolean) => {
  const schema = registerSchema(isLoginPage); 

  return useForm({
    resolver: yupResolver(schema),
  });
};
