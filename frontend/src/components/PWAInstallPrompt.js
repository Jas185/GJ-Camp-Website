/**
 * Composant PWAInstallPrompt - Bouton pour installer l'application
 * Affiche un bouton "Installer l'app" quand l'installation PWA est possible
 */

import React, { useState, useEffect } from 'react';
import '../styles/PWAInstall.css';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Empêcher le navigateur d'afficher sa propre invite
      e.preventDefault();
      // Stocker l'événement pour l'utiliser plus tard
      setDeferredPrompt(e);
      setShowInstallButton(true);
      console.log('📱 PWA installable détectée');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Vérifier si déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('✅ Application déjà installée');
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Afficher l'invite d'installation
    deferredPrompt.prompt();

    // Attendre le choix de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ Utilisateur a accepté l\'installation');
    } else {
      console.log('❌ Utilisateur a refusé l\'installation');
    }

    // Réinitialiser le prompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return null;

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">📱</div>
        <div className="pwa-install-text">
          <h4>Installer GJ Camp</h4>
          <p>Accédez rapidement à l'app depuis votre écran d'accueil</p>
        </div>
        <button className="pwa-install-button" onClick={handleInstallClick}>
          Installer
        </button>
        <button 
          className="pwa-install-close" 
          onClick={() => setShowInstallButton(false)}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
