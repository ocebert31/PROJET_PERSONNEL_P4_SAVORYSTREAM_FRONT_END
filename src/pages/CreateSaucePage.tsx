import { createSauces } from '../services/sauceServices';
import InputFieldForm from "../common/InputFieldForm";
import { Sauce } from '../types/Sauce';
import ItemListManager from '../common/ItemListManager';
import { useCreateSauceForm } from '../hooks/useCreateSauceForm';

function CreateSaucePage() {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useCreateSauceForm();
    
    const ingredients = watch("ingredients", []);
    const quantite = watch("quantite", []);
    
    const onSubmit = async (data: Sauce) => {
        try {
            console.log("Form submitted! Calling createSauces...");
            await createSauces(data);
        } catch (error) {
            console.error("Erreur lors de la création de la sauce", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full p-6 max-w-6xl bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-primary mb-6">Création d'une sauce</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputFieldForm label="Nom de la sauce" name="nom" register={register} errors={errors} id="nom" htmlFor="nom"/>
                    <InputFieldForm label="Description" name="description" register={register} errors={errors} id="description" htmlFor="description" type="textarea"/>
                    <InputFieldForm label="Caractéristique" name="caracteristique" register={register} errors={errors} id="caracteristique" htmlFor="caracteristique"/>
                    <InputFieldForm label="Prix" name="prix" register={register} errors={errors} id="prix" htmlFor="prix" type="number" />
                    <ItemListManager error={errors.ingredients}  label="Ingrédient" id="ingredient" list={ingredients} field="ingredients" setValue={setValue}/>
                    <ItemListManager error={errors.quantite}  label="Quantité" id="quantite" list={quantite} field="quantite" setValue={setValue}/>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                            Ajouter la sauce
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSaucePage;