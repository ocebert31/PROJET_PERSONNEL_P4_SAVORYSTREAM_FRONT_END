import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RouterComponent from '../../routes/RouterComponent';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

const renderWithRouter = (initialRoute: string) => {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <RouterComponent />
    </MemoryRouter>
  );
};

describe('Navigation behavior', () => {
  const routes = [
    { path: '/register', text: /Inscription/i },
    { path: '/login', text: /Connexion/i }
  ];

  routes.forEach(({ path, text }) => {
    it(`renders the correct page when navigating to ${path}`, () => {
      renderWithRouter(path);
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    it(`does not render the page when not on ${path}`, () => {
      renderWithRouter('/other-route');
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    });
  });
});
