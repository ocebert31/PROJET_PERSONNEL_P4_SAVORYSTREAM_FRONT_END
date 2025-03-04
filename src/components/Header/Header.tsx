import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className='w-full bg-primary p-8'>
            <nav className='flex justify-between'>
                <Link to='/' className='text-white'>Accueil</Link>
                <Link to='/register' className='text-white'>Inscription</Link>
                <Link to='/login' className='text-white'>Connexion</Link>
            </nav>
        </header>
    );
}

export default Header;
