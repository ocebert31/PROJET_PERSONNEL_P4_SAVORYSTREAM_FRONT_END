import { vi, expect, it, describe, Mock } from 'vitest';
import { getSauces } from '../../services/sauceServices';
import { fetchRequest } from '../../services/apiRequest';
import { mockSauces } from '../_mocks_/mockSauces';

vi.mock('../../services/apiRequest', () => ({
  fetchRequest: vi.fn()
}));

describe('getSauces', () => {
  it('should fetch sauces correctly', async () => {
    (fetchRequest as Mock).mockResolvedValueOnce(mockSauces);
    const sauces = await getSauces();
    expect(sauces).toEqual(mockSauces);
    expect(fetchRequest).toHaveBeenCalledWith('/sauces', { method: 'GET', url: expect.any(String) });
  });

  it('should handle errors correctly', async () => {
    (fetchRequest as Mock).mockRejectedValueOnce(new Error('Erreur lors du fetch sauces'));
    try {
      await getSauces(); 
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
