export type Sauce = {
    id: string,
    nom: string, 
    prix: number, 
    description: string, 
    ingredients: string[], 
    quantite: string[], 
    caracteristique: string, 
}

export interface ItemListManagerProps {
    label: string;
    id: string;
    list: string[];
    setList: React.Dispatch<React.SetStateAction<string[]>>;
    field: keyof Sauce;
    setValue: (field: keyof Sauce, value: string[]) => void;
    className?: string;
}