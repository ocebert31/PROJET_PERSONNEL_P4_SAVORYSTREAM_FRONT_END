import { Sauce } from '../../types/Sauce';

const baseSauce: Sauce = {
  id: "1",
  nom: 'Nom de la sauce',
  quantite: ['100ml'],
  prix: 0,
  description: 'Description de la sauce',
  ingredients: ['Ingrédient principal'],
  caracteristique: 'Caractéristique de la sauce',
};

export const mockSauces: Sauce[] = [
  { ...baseSauce},
];

export const mockNewSauce: Sauce = {
  ...baseSauce,
};
