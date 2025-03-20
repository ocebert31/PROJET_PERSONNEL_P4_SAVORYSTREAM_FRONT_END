import { AuthenticationSchema } from '../../schemas/AuthenticationSchema';
import { describe, it, expect } from 'vitest';
import { ValidationError } from 'yup';

const validData = {
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123',
};

const invalidEmailData = {
    email: 'invalid-email',
    password: 'password123',
    confirmPassword: 'password123',
};

const noEmailData = {
    password: 'password123',
    confirmPassword: 'password123',
};

const shortPasswordData = {
    email: 'test@example.com',
    password: '123',
    confirmPassword: '123',
};

const noPasswordData = {
    email: 'test@example.com',
    confirmPassword: 'password123',
};

const mismatchedPasswordData = {
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'wrongpassword',
};

const noConfirmPasswordData = {
    email: 'test@example.com',
    password: 'password123',
};

const validLoginData = {
    email: 'login@example.com',
    password: 'password123',
};

const validateData = async (data: any) => {
    return AuthenticationSchema(false).validate(data);
};
  
const validateError = (error: unknown, expectedError: string | null) => {
    const validationError = error as ValidationError;
    if (expectedError) {
        expect(validationError.errors).toContain(expectedError);
    } else {
        expect(validationError.errors).not.toContain(expectedError);
    }
};
  
const validateSchema = async (data: any, expectedError: string | null = null, isLoginPage: boolean = false) => {
    try {
        if (expectedError) {
            await validateData(data);
        } else {
            await expect(AuthenticationSchema(isLoginPage).isValid(data)).resolves.toBe(true); 
        }
    } catch (error) {
        validateError(error, expectedError); 
    }
};
  

describe('registerSchema validation when it is Register Page', () => {
    it('should validate correct data', async () => {
        await validateSchema(validData);
    });

    it('should invalidate incorrect email', async () => {
        await validateSchema(invalidEmailData, "L'email est invalide");
    });

    it('should require email', async () => {
        await validateSchema(noEmailData, "L'email est requis");
    });

    it('should invalidate password less than 6 characters', async () => {
        await validateSchema(shortPasswordData, "Au moins 6 caractères");
    });

    it('should require password', async () => {
        await validateSchema(noPasswordData, "Mot de passe requis");
    });

    it('should invalidate mismatched passwords', async () => {
        await validateSchema(mismatchedPasswordData, "Les mots de passe doivent correspondre");
    });

    it('should require confirmPassword', async () => {
        await validateSchema(noConfirmPasswordData, "Confirmation requise");
    });
});

describe('registerSchema validation when it is Login Page', () => {
    it('should not require confirmPassword on login page (isLoginPage = true)', async () => {
        await validateSchema(validLoginData, "", true);
    });
});