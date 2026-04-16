import { Link } from "react-router-dom";

function FooterLegalLinks() {
  return (
    <nav aria-label="Liens légaux">
      <ul className="flex flex-wrap items-center gap-3">
        <li>
          <Link to="/mentions-legales" className="underline-offset-2 transition hover:text-foreground hover:underline">
            Mentions légales
          </Link>
        </li>
        <li aria-hidden className="text-border">·</li>
        <li>
          <Link to="/confidentialite" className="underline-offset-2 transition hover:text-foreground hover:underline">
            Confidentialité
          </Link>
        </li>
        <li aria-hidden className="text-border">·</li>
        <li>
          <Link to="/cgv" className="underline-offset-2 transition hover:text-foreground hover:underline">
            CGV
          </Link>
        </li>
        <li aria-hidden className="text-border">·</li>
        <li>
          <Link to="/cookies" className="underline-offset-2 transition hover:text-foreground hover:underline">
            Cookies
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default FooterLegalLinks;
