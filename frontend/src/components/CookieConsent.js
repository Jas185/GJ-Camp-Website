import React, { useState } from 'react';
import '../styles/CookieConsent.css';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(() => {
    return !localStorage.getItem('cookieConsent');
  });
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  const acceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const acceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        <div className="cookie-header">
          <h3>🍪 Gestion des Cookies</h3>
        </div>

        {!showSettings ? (
          <>
            <p className="cookie-description">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. 
              Les cookies nécessaires sont essentiels au fonctionnement du site (authentification, panier). 
              Vous pouvez choisir d'accepter ou de refuser les cookies optionnels.
            </p>
            <div className="cookie-actions">
              <button className="btn-accept-all" onClick={acceptAll}>
                ✓ Tout Accepter
              </button>
              <button className="btn-customize" onClick={() => setShowSettings(true)}>
                ⚙️ Personnaliser
              </button>
              <button className="btn-reject" onClick={rejectAll}>
                ✗ Tout Refuser
              </button>
            </div>
            <p className="cookie-link">
              <a href="/politique-confidentialite" target="_blank">
                Politique de confidentialité
              </a>
            </p>
          </>
        ) : (
          <>
            <div className="cookie-settings">
              <div className="cookie-category">
                <div className="category-header">
                  <input 
                    type="checkbox" 
                    id="necessary" 
                    checked={preferences.necessary} 
                    disabled 
                  />
                  <label htmlFor="necessary">
                    <strong>Cookies Nécessaires</strong>
                    <span className="required-badge">Obligatoire</span>
                  </label>
                </div>
                <p className="category-description">
                  Ces cookies sont essentiels pour vous permettre de naviguer sur le site et d'utiliser 
                  ses fonctionnalités (connexion, inscription, panier d'achat).
                </p>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <input 
                    type="checkbox" 
                    id="analytics" 
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                  />
                  <label htmlFor="analytics">
                    <strong>Cookies Analytiques</strong>
                  </label>
                </div>
                <p className="category-description">
                  Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site 
                  en collectant des informations de manière anonyme.
                </p>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <input 
                    type="checkbox" 
                    id="marketing" 
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                  />
                  <label htmlFor="marketing">
                    <strong>Cookies Marketing</strong>
                  </label>
                </div>
                <p className="category-description">
                  Ces cookies sont utilisés pour suivre les visiteurs à travers les sites web afin 
                  d'afficher des publicités pertinentes.
                </p>
              </div>
            </div>

            <div className="cookie-actions">
              <button className="btn-save" onClick={acceptSelected}>
                ✓ Enregistrer mes Préférences
              </button>
              <button className="btn-back" onClick={() => setShowSettings(false)}>
                ← Retour
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
