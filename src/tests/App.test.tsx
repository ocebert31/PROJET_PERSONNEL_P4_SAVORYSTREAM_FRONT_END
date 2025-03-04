import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

describe('App Router Integration Test', () => {
  it('renders the app without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('renders the Header component', () => {
    render (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
