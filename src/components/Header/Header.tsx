import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/85 backdrop-blur-md shadow-sm shadow-stone-900/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 lg:h-[4.25rem]">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-primary transition hover:text-primary-hover sm:text-2xl">
          SavoryStream
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navigation principale">
          <Link to="/" className="rounded-full px-3 py-2 text-sm font-medium text-foreground/90 transition hover:bg-background hover:text-primary sm:px-4">
            Accueil
          </Link>
          <Link to="/register" className="rounded-full px-3 py-2 text-sm font-medium text-foreground/90 transition hover:bg-background hover:text-primary sm:px-4">
            Inscription
          </Link>
          <Link to="/login" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-hover sm:px-5">
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
