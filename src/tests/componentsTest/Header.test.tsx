import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, beforeEach } from 'vitest';
import Header from '../../components/Header/Header';

const setup = () => {
  render(
    <BrowserRouter>
        <Header />
    </BrowserRouter>
  );
};

describe('Header component', () => {
    beforeEach(() => {
        setup();
    });

    it('renders links', () => {
        const links = ['Accueil', 'Inscription', 'Connexion'];
        links.forEach((link) => {
            expect(screen.getByText(link)).toBeInTheDocument();
        });
    });

    it('renders links with the correct href attributes', () => {
        const links = [
            { text: 'Accueil', href: '/' },
            { text: 'Inscription', href: '/register' },
            { text: 'Connexion', href: '/login' },
        ];
    
        links.forEach(({ text, href }) => {
            expect(screen.getByText(text).closest('a')).toHaveAttribute('href', href);
        });
    });
});
