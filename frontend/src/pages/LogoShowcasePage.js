import React from 'react';
import ModernLogo from '../components/ModernLogo';
import '../styles/App.css';

const LogoShowcasePage = () => {
  const logos = [
    { id: 1, name: 'Dégradé Minimaliste', description: 'Logo circulaire avec effet de brillance' },
    { id: 2, name: 'Hexagone Géométrique', description: 'Design polygonal avec rotation' },
    { id: 3, name: 'Effet 3D', description: 'Profondeur avec plusieurs couches' },
    { id: 4, name: 'Anneaux Dynamiques', description: 'Cercles animés avec particules' },
    { id: 5, name: 'Badge Moderne', description: 'Style insigne avec sous-titre' },
    { id: 6, name: 'Néon', description: 'Effet lumineux sur fond sombre' },
    { id: 7, name: 'App Icon', description: 'Style icône d\'application iOS/Android' },
    { id: 8, name: 'Cercles Concentriques', description: 'Anneaux pulsants multiples' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '60px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '24px',
        padding: '50px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '42px',
          fontWeight: '900',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Logos Modernes GJ Camp
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '18px',
          color: '#718096',
          marginBottom: '60px'
        }}>
          Sélectionnez votre logo préféré parmi ces 8 designs modernes
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {logos.map((logo) => (
            <div key={logo.id} style={{
              background: '#f7fafc',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              border: '2px solid #e2e8f0',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
              <div style={{ marginBottom: '24px' }}>
                <ModernLogo variant={logo.id} size="large" />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#2d3748',
                marginBottom: '8px'
              }}>
                {logo.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#718096',
                lineHeight: '1.5'
              }}>
                {logo.description}
              </p>
              <div style={{
                marginTop: '16px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#667eea',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Variant {logo.id}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '16px' }}>
            Comment utiliser ?
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.95, maxWidth: '800px', margin: '0 auto' }}>
            Pour utiliser un logo, importez le composant <code style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontWeight: '700'
            }}>ModernLogo</code> et spécifiez le variant (1-8) et la taille (small, medium, large, xlarge)
          </p>
          <div style={{
            marginTop: '24px',
            background: 'rgba(0,0,0,0.2)',
            padding: '20px',
            borderRadius: '12px',
            fontFamily: 'monospace',
            fontSize: '14px',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '24px auto 0'
          }}>
            <div>{'<ModernLogo variant={1} size="large" />'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcasePage;
