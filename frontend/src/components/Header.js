import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/App.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img src="/logo.jpeg" alt="Logo GJ" />
        </Link>
        <nav className="nav-menu">
          <li><Link to="/">ACCUEIL</Link></li>
          <li><Link to="/#agenda">MON GJ AGENDA</Link></li>
          <li><Link to="/#activites">NOS ACTIVITES</Link></li>
          <li><Link to="/#apropos">À PROPOS</Link></li>
        </nav>
        <div className="user-menu">
          {isAuthenticated ? (
            <>
              <span>{user?.firstName} {user?.lastName}</span>
              <button className="btn-secondary" onClick={logout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-primary">CONNEXION</button>
              </Link>
              <Link to="/signup">
                <button className="btn-secondary">S'INSCRIRE</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
