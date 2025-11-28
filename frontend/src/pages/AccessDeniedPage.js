import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/AccessDeniedPage.css';

const AccessDeniedPage = () => {
  const location = useLocation();
  const requiredRoles = location.state?.required;

  return (
    <div className="access-denied-container">
      <div className="access-card">
        <span className="access-icon" aria-hidden>
          🔒
        </span>
        <h1>Accès refusé</h1>
        <p>
          Vous n'avez pas les droits nécessaires pour consulter cette page.
          {requiredRoles && requiredRoles.length > 0 && (
            <span className="access-roles">Rôles requis : {requiredRoles.join(', ')}</span>
          )}
          {!requiredRoles && (
            <span className="access-roles">
              Si votre email n'est pas vérifié, validez-le depuis votre boîte de réception ou renvoyez un nouveau lien.
            </span>
          )}
        </p>
        <div className="access-actions">
          <Link to="/">
            <button className="btn-secondary">Retour à l'accueil</button>
          </Link>
          <Link to="/profil">
            <button className="btn-primary">Consulter mon profil</button>
          </Link>
          <Link to="/resend-verification">
            <button className="btn-secondary">Renvoyer l'email de vérification</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
