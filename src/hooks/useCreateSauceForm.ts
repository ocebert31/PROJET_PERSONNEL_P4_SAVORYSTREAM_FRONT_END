import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateSauceSchema } from "../schemas/SauceSchema";
import { Sauce } from "../types/Sauce";

export const useCreateSauceForm = () => {
  return useForm<Sauce>({
    resolver: yupResolver(CreateSauceSchema),
    defaultValues: {
      nom: "",
      description: "",
      caracteristique: "",
      prix: 0,
      ingredients: [],
      quantite: []
    }
  });
};
