import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user } = useAuth();
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
      isActive
        ? "bg-background text-primary"
        : "text-foreground/90 hover:bg-background hover:text-primary"
    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/85 backdrop-blur-md shadow-sm shadow-stone-900/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 lg:h-[4.25rem]">
        <NavLink to="/" className="font-display text-xl font-semibold tracking-tight text-primary transition hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:text-2xl">
          SavoryStream
        </NavLink>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navigation principale">
          <NavLink to="/" className={navLinkClass}>
            Accueil
          </NavLink>
          {user?.role === 'admin' ? (
            <NavLink to="/dashboard/sauces/create" className={navLinkClass}>
              Créer une sauce
            </NavLink>
          ) : null}
          <NavLink to="/register" className={navLinkClass}>
            Inscription
          </NavLink>
          <NavLink to="/login" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:px-5">
            Connexion
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
