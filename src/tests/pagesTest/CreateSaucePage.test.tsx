import { render, screen, waitFor } from '@testing-library/react';
import CreateSaucePage from '../../pages/CreateSaucePage';
import { createSauces } from '../../services/sauceServices';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { mockNewSauce } from '../_mocks_/mockSauces';
import { Sauce } from '../../types/Sauce';

vi.mock("../../services/sauceServices", async () => {
  const actual = await vi.importActual("../../services/sauceServices");
  return {
    ...actual,
    createSauces: vi.fn(),
  };
});

const getNameInput = () => screen.getByLabelText(/Nom de la sauce/i);
const getDescriptionInput = () => screen.getByLabelText('Description');
const getCharacteristicInput = () => screen.getByLabelText(/Caractéristique/i);
const getPriceInput = () => screen.getByLabelText('Prix');
const getIngredientInput = () => screen.getByLabelText(/Ingrédient/i);
const getQuantityInput = () => screen.getByLabelText('Quantité');
const getSubmittButton = () => screen.getByRole('button', { name: /Ajouter la sauce/i });

const fillAndSubmitForm = async (mockNewSauce: Sauce) => {
  await userEvent.type(getNameInput(), mockNewSauce.nom);
  await userEvent.type(getDescriptionInput(), mockNewSauce.description);
  await userEvent.type(getCharacteristicInput(), mockNewSauce.caracteristique);
  await userEvent.type(getPriceInput(), String(mockNewSauce.prix));
  
  for (const ingredient of mockNewSauce.ingredients) {
    await userEvent.type(getIngredientInput(), ingredient);
    await userEvent.keyboard('{Enter}');
  }

  for (const quantite of mockNewSauce.quantite) {
    await userEvent.type(getQuantityInput(), quantite);
    await userEvent.keyboard('{Enter}');
  }
  await userEvent.click(getSubmittButton());
};

describe('CreateSaucePage - Form behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<CreateSaucePage />);
  });
  
  test('should not submit form with invalid data (prix non numérique)', async () => {
    const invalidSauce = { ...mockNewSauce, prix: 'invalid' as any };
    await fillAndSubmitForm(invalidSauce);
    await waitFor(() => {
      expect(createSauces).not.toHaveBeenCalled();
      expect(screen.getByText(/Le prix doit être un nombre/i)).toBeInTheDocument();
    });
  });

  test('should display error message if a required field is missing', async () => {
    await userEvent.click(getSubmittButton());  
    await waitFor(() => {
      expect(createSauces).not.toHaveBeenCalled();
      expect(screen.getByText(/Nom de la sauce est requis/i)).toBeInTheDocument();
    });
  });
});