import * as yup from "yup";

export const CreateSauceSchema = yup.object({
    nom: yup.string()
        .required("Le nom de la sauce est requis")
        .min(3, "Le nom doit contenir au moins 3 caractères"),
    
    description: yup.string()
        .required("La description est requise")
        .min(10, "La description doit contenir au moins 10 caractères"),
    
    caracteristique: yup.string()
        .required("La caractéristique est requise"),
    
    prix: yup.number()
        .required("Le prix est requis")
        .positive("Le prix doit être un nombre positif")
        .typeError("Le prix doit être un nombre valide"),
    
    ingredients: yup.array()
        .of(yup.string().required("Chaque ingrédient doit être renseigné"))
        .min(1, "Au moins un ingrédient est requis")
        .required("Les ingrédients sont requis"), 
    
    quantite: yup.array()
        .of(yup.string().required("Chaque quantité doit être renseignée"))
        .min(1, "Au moins une quantité est requise")
        .required("Les quantités sont requises")
});
