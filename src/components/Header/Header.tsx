import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <Link to='/'>Accueil</Link>
            <Link to='/register'>Inscription</Link>
            <Link to='/login'>Connexion</Link>
        </header>
    )
}

export default Header;