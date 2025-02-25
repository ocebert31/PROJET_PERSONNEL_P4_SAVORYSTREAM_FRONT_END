import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { registerSchema } from "../schemas/RegisterSchema";

export const useFormSchema = () => {
  return useForm({ resolver: yupResolver(registerSchema) });
};
