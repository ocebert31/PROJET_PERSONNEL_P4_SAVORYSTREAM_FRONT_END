import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RouterComponent from '../../routes/RouterComponent';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

describe('RouterComponent', () => {
  it('renders RegisterPage when navigating to /register', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <RouterComponent />
      </MemoryRouter>
    );
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
  });

  it('does not render RegisterPage when navigating to another route', () => {
    render(
      <MemoryRouter initialEntries={['/other-route']}>
        <RouterComponent />
      </MemoryRouter>
    );
    expect(screen.queryByText(/Inscription/i)).not.toBeInTheDocument();
  });
});
