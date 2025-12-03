import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ModernLogo.css';

/**
 * Composant pour afficher le logo en position fixe à l'écran
 * Utilisé uniquement quand logoPosition !== 'header'
 */
const FixedLogo = () => {
  const [customLogo, setCustomLogo] = useState(null);
  const [logoSize, setLogoSize] = useState({ width: '120px', height: 'auto' });
  const [logoEffects, setLogoEffects] = useState({
    shape: 'none',
    effect: 'none',
    animation: 'none',
    borderColor: '#d4af37',
    glowColor: '#d4af37'
  });
  const [logoPosition, setLogoPosition] = useState({
    type: 'header',
    customX: '50',
    customY: '50'
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Charger le logo et ses paramètres
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data.success && response.data.settings.logoUrl) {
          const settings = response.data.settings;
          setCustomLogo(settings.logoUrl);
          setLogoSize({
            width: settings.logoWidth || '120px',
            height: settings.logoHeight || 'auto'
          });
          setLogoEffects({
            shape: settings.logoShape || 'none',
            effect: settings.logoEffect || 'none',
            animation: settings.logoAnimation || 'none',
            borderColor: settings.logoBorderColor || '#d4af37',
            glowColor: settings.logoGlowColor || '#d4af37'
          });
          setLogoPosition({
            type: settings.logoPosition || 'header',
            customX: settings.logoCustomX || '50',
            customY: settings.logoCustomY || '50'
          });
        }
      } catch (error) {
        console.log('⚠️ Impossible de charger le logo fixe');
      }
    };
    fetchLogo();

    // Écouter les mises à jour du logo
    const handleLogoUpdate = () => {
      setRefreshKey(prev => prev + 1);
      fetchLogo();
    };
    window.addEventListener('logoUpdated', handleLogoUpdate);

    return () => {
      window.removeEventListener('logoUpdated', handleLogoUpdate);
    };
  }, [refreshKey]);

  // Calculer les styles visuels
  const getLogoStyles = () => {
    return {
      width: logoSize.width,
      height: logoSize.height,
      objectFit: 'contain',
      borderRadius: 
        logoEffects.shape === 'circle' ? '50%' :
        logoEffects.shape === 'rounded' ? '12px' :
        logoEffects.shape === 'square' ? '0' :
        logoEffects.shape === 'hexagon' ? '0' : '0',
      border: 
        logoEffects.effect === 'border' ? `3px solid ${logoEffects.borderColor}` :
        logoEffects.effect === 'gradient-border' ? '3px solid transparent' : 'none',
      boxShadow: 
        logoEffects.effect === 'shadow' ? '0 8px 24px rgba(0, 0, 0, 0.3)' :
        logoEffects.effect === 'glow' ? `0 0 20px ${logoEffects.glowColor}` :
        logoEffects.effect === '3d' ? '5px 5px 15px rgba(0, 0, 0, 0.5), -5px -5px 15px rgba(255, 255, 255, 0.1)' : 'none',
      backgroundImage: logoEffects.effect === 'gradient-border' ? 
        `linear-gradient(white, white), linear-gradient(135deg, ${logoEffects.borderColor}, #764ba2)` : 'none',
      backgroundOrigin: 'border-box',
      backgroundClip: logoEffects.effect === 'gradient-border' ? 'padding-box, border-box' : 'initial',
      transform: logoEffects.effect === '3d' ? 'perspective(1000px) rotateY(5deg)' : 'none',
      transition: 'all 0.3s ease'
    };
  };

  // Calculer la position fixe
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 9999
    };

    switch (logoPosition.type) {
      case 'fixed-top-left':
        return { ...baseStyles, top: '20px', left: '20px' };
      case 'fixed-top-right':
        return { ...baseStyles, top: '20px', right: '20px' };
      case 'fixed-bottom-left':
        return { ...baseStyles, bottom: '20px', left: '20px' };
      case 'fixed-bottom-right':
        return { ...baseStyles, bottom: '20px', right: '20px' };
      case 'custom':
        return { 
          ...baseStyles, 
          top: `${logoPosition.customY}px`, 
          left: `${logoPosition.customX}px` 
        };
      default:
        return null; // Pas de position fixe
    }
  };

  const positionStyles = getPositionStyles();

  // N'afficher que si :
  // 1. Un logo personnalisé existe
  // 2. La position n'est pas 'header'
  if (!customLogo || logoPosition.type === 'header' || !positionStyles) {
    return null;
  }

  const combinedStyles = {
    ...getLogoStyles(),
    ...positionStyles
  };

  return (
    <div className="fixed-logo-container">
      <img 
        src={`${customLogo}?t=${Date.now()}`}
        alt="GJ Camp Logo" 
        className={`fixed-logo ${logoEffects.animation}`}
        style={combinedStyles}
      />
    </div>
  );
};

export default FixedLogo;
