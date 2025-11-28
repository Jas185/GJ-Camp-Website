import React from 'react';
import '../styles/ModernLogo.css';

const ModernLogo = ({ variant = 1, size = 'medium' }) => {
  const renderLogo = () => {
    switch (variant) {
      case 1:
        // Logo minimaliste avec GJ en dégradé
        return (
          <div className={`modern-logo logo-variant-1 logo-${size}`}>
            <div className="logo-circle">
              <span className="logo-text">GJ</span>
            </div>
          </div>
        );
      
      case 2:
        // Logo géométrique avec hexagone
        return (
          <div className={`modern-logo logo-variant-2 logo-${size}`}>
            <div className="hexagon">
              <span className="logo-text">GJ</span>
            </div>
          </div>
        );
      
      case 3:
        // Logo 3D avec effet de profondeur
        return (
          <div className={`modern-logo logo-variant-3 logo-${size}`}>
            <div className="logo-3d">
              <div className="layer layer-1">GJ</div>
              <div className="layer layer-2">GJ</div>
              <div className="layer layer-3">GJ</div>
            </div>
          </div>
        );
      
      case 4:
        // Logo avec anneau et particules
        return (
          <div className={`modern-logo logo-variant-4 logo-${size}`}>
            <div className="ring-container">
              <div className="ring"></div>
              <div className="ring ring-2"></div>
              <span className="logo-text">GJ</span>
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
            </div>
          </div>
        );
      
      case 5:
        // Logo style badge moderne
        return (
          <div className={`modern-logo logo-variant-5 logo-${size}`}>
            <div className="badge">
              <div className="badge-inner">
                <span className="logo-text">GJ</span>
                <span className="badge-subtitle">CAMP</span>
              </div>
            </div>
          </div>
        );
      
      case 6:
        // Logo avec effet néon
        return (
          <div className={`modern-logo logo-variant-6 logo-${size}`}>
            <div className="neon-container">
              <span className="neon-text">GJ</span>
            </div>
          </div>
        );
      
      case 7:
        // Logo carré arrondi style app
        return (
          <div className={`modern-logo logo-variant-7 logo-${size}`}>
            <div className="app-icon">
              <div className="icon-gradient"></div>
              <span className="logo-text">GJ</span>
              <div className="icon-shine"></div>
            </div>
          </div>
        );
      
      case 8:
        // Logo avec cercles concentriques
        return (
          <div className={`modern-logo logo-variant-8 logo-${size}`}>
            <div className="concentric">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
              <span className="logo-text">GJ</span>
            </div>
          </div>
        );
      
      default:
        return renderLogo(1);
    }
  };

  return renderLogo();
};

export default ModernLogo;
