import { vi, expect, it, describe, Mock } from 'vitest';
import { getSauces, createSauces } from '../../services/sauceServices';
import { fetchRequest } from '../../services/apiRequest';
import { mockSauces, mockNewSauce } from '../_mocks_/mockSauces';

vi.mock('../../services/apiRequest', () => ({
  fetchRequest: vi.fn()
}));

const testApiRequest = async ( apiFunction: Function, mockData: any, url: string, method: string, body?: any) => {
  (fetchRequest as Mock).mockResolvedValueOnce(mockData);
  const response = await apiFunction(body);
  expect(response).toEqual(mockData);
  expect(fetchRequest).toHaveBeenCalledWith(url, { method, body, url: expect.any(String) });
};

const testApiRequestError = async ( apiFunction: Function, mockError: Error, body?: any ) => {
  (fetchRequest as Mock).mockRejectedValueOnce(mockError);
  try {
    await apiFunction(body);
  } catch (error) {
    expect(error).toBeDefined();
  }
};

describe('Sauce Services', () => {
  describe('getSauces', () => {
    it('should fetch sauces correctly', async () => {
      await testApiRequest(getSauces, mockSauces, '/sauces', 'GET');
    });

    it('should handle errors correctly', async () => {
      await testApiRequestError(getSauces, new Error('Erreur lors du fetch sauces'));
    });
  });

  describe('createSauces', () => {
    it('should create a new sauce correctly', async () => {
      await testApiRequest(createSauces, mockNewSauce, '/sauces', 'POST', mockNewSauce);
    });

    it('should handle errors when creating a sauce', async () => {
      await testApiRequestError(createSauces, new Error('Erreur lors de la création de la sauce'), mockNewSauce);
    });
  });
});
