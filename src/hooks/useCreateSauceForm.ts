import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  SauceCreateSchema,
  sauceCreateDefaultValues,
  type SauceCreateFormValues,
} from "../schemas/sauceCreateSchema";

export function useCreateSauceForm(): ReturnType<typeof useForm<SauceCreateFormValues>> {
  const schema = SauceCreateSchema();
  return useForm<SauceCreateFormValues>({
    resolver: yupResolver(schema),
    defaultValues: sauceCreateDefaultValues,
  });
}
