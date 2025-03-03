import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, Mock } from 'vitest';
import HomePage from '../../pages/HomePage';
import { getSauces } from '../../services/sauceServices'; 
import { mockSauces } from '../_mocks_/mockSauces';

vi.mock('../../services/sauceServices', () => ({
  getSauces: vi.fn(),
}));

vi.spyOn(console, 'error').mockImplementation(() => {});

describe('HomePage', () => {
  it('should display sauces correctly', async () => {
    (getSauces as Mock).mockResolvedValueOnce(mockSauces);
    render(<HomePage />);
    await waitFor(() => screen.getByText('Sauce A'));
    expect(screen.getByText('Sauce A')).toBeInTheDocument();
    expect(screen.getByText('Description de Sauce A')).toBeInTheDocument();
  });

  it('should handle errors gracefully', async () => {
    (getSauces as Mock).mockRejectedValueOnce(new Error('Erreur lors de la récupération des sauces'));
    render(<HomePage />);
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Erreur lors de la récupération des sauces.'));
  });

  it('should handle empty sauces list gracefully', async () => {
    (getSauces as Mock).mockResolvedValueOnce([]);
    render(<HomePage />);
    await waitFor(() => expect(screen.queryByText('Sauce A')).toBeNull());
    expect(screen.getByText('Aucune sauce disponible')).toBeInTheDocument();
  });
});
