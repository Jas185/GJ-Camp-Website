import React from 'react';
import '../styles/App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>Tous droits réservés. Génération Josué</p>
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
    </footer>
  );
};

export default Footer;
