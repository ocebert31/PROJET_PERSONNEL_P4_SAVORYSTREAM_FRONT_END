import { CreateSauceSchema } from '../../schemas/SauceSchema';
import { describe, it, expect } from 'vitest';
import { ValidationError } from 'yup';

const validData = {
    nom: 'Sauce piquante',
    description: 'Une sauce très épicée avec du piment et de la moutarde.',
    caracteristique: 'Piquante',
    prix: 5.99,
    ingredients: ['piment', 'moutarde', 'vinaigre'],
    quantite: ['100g', '50g', '200g'],
};

const generateInvalidData = (overrides: Partial<typeof validData>) => ({
    ...validData,
    ...overrides,
});

const validateData = async (data: any) => {
    return CreateSauceSchema.validate(data);
};

const validateError = (error: unknown, expectedError: string | null) => {
    const validationError = error as ValidationError;
    if (expectedError !== null) {
        expect(validationError.errors).toContain(expectedError);
    } else {
        expect(validationError.errors).toHaveLength(0);
    }
};

const validateSchema = async (data: any, expectedError: string | null = null) => {
    try {
        if (expectedError) {
            await validateData(data);
        } else {
            await expect(CreateSauceSchema.isValid(data)).resolves.toBe(true);
        }
    } catch (error) {
        validateError(error, expectedError);
    }
};

describe('Nom validation', () => {
    it('should require nom', async () => {
        await validateSchema(generateInvalidData({ nom: '' }), "Le nom de la sauce est requis");
    });

    it('should invalidate nom too short', async () => {
        await validateSchema(generateInvalidData({ nom: 'So' }), "Le nom doit contenir au moins 3 caractères");
    });

    it('should validate valid nom', async () => {
        await validateSchema(validData);
    });
});

describe('Description validation', () => {
    it('should require description', async () => {
        await validateSchema(generateInvalidData({ description: '' }), "La description est requise");
    });

    it('should invalidate short description', async () => {
        await validateSchema(generateInvalidData({ description: 'Trop court' }), "La description doit contenir au moins 10 caractères");
    });

    it('should validate valid description', async () => {
        await validateSchema(validData);
    });
});

describe('Caracteristique validation', () => {
    it('should require caracteristique', async () => {
        await validateSchema(generateInvalidData({ caracteristique: '' }), "La caractéristique est requise");
    });

    it('should validate valid caracteristique', async () => {
        await validateSchema(validData);
    });
});

describe('Prix validation', () => {
    it('should require prix', async () => {
        await validateSchema(generateInvalidData({ prix: undefined }), "Le prix est requis");
    });

    it('should invalidate prix as negative', async () => {
        await validateSchema(generateInvalidData({ prix: -5 }), "Le prix doit être un nombre positif");
    });

    it('should invalidate prix as non-number', async () => {
        await validateSchema(generateInvalidData({ prix: 'abc' as any }), "Le prix doit être un nombre valide");
    });

    it('should validate valid prix', async () => {
        await validateSchema(validData);
    });
});

describe('Ingredients validation', () => {
    it('should require ingredients', async () => {
        await validateSchema(generateInvalidData({ ingredients: [] }), "Au moins un ingrédient est requis");
    });

    it('should invalidate missing ingredient', async () => {
        await validateSchema(generateInvalidData({ ingredients: ['piment', '', 'moutarde'] }), "Chaque ingrédient doit être renseigné");
    });

    it('should validate valid ingredients', async () => {
        await validateSchema(validData);
    });
});

describe('Quantite validation', () => {
    it('should require quantite', async () => {
        await validateSchema(generateInvalidData({ quantite: [] }), "Au moins une quantité est requise");
    });

    it('should invalidate missing quantite', async () => {
        await validateSchema(generateInvalidData({ quantite: ['100g', '', '50g'] }), "Chaque quantité doit être renseignée");
    });

    it('should validate valid quantite', async () => {
        await validateSchema(validData);
    });
});
