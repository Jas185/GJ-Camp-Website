import React from 'react';
import { Link } from 'react-router-dom';
import ModernLogo from './ModernLogo';
import '../styles/App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <img 
              src={process.env.PUBLIC_URL + '/logo.jpeg'} 
              alt="Logo Génération Josué" 
              style={{
                height: 64,
                width: 64,
                objectFit: 'cover',
                borderRadius: '50%',
                border: '3px solid #d4af37',
                boxShadow: '0 0 10px rgba(212,175,55,0.25)'
              }}
            />
          </div>
          <p className="footer-text">© {new Date().getFullYear()} Génération Josué — Tous droits réservés</p>
        </div>
        <div className="footer-right">
          <nav className="footer-nav">
            <Link className="footer-link" to="/a-propos">GJ CRPT</Link>
            <Link className="footer-link" to="/activites">Activités</Link>
            <Link className="footer-link" to="/politique-confidentialite">Confidentialité</Link>
            <Link className="footer-link" to="/conditions-utilisation">CGU</Link>
            <Link className="footer-link" to="/gestion-donnees">Mes Données</Link>
          </nav>
          <div className="social-links">\n            <a href="https://www.youtube.com" className="social-icon" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
