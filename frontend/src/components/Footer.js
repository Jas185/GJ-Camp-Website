import React from 'react';
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
            <a className="footer-link" href="#apropos">GJ CRPT</a>
            <a className="footer-link" href="#activites">Activités</a>
            <a className="footer-link" href="#contact">Contact</a>
          </nav>
          <div className="social-links">
            <a href="https://www.youtube.com" className="social-icon" target="_blank" rel="noopener noreferrer">
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
