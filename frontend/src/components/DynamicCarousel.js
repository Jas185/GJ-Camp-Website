/**
 * DynamicCarousel - Composant carrousel dynamique réutilisable
 * Charge les slides depuis l'API en fonction de la page
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DynamicCarousel.css';

const DynamicCarousel = ({ page = 'home', height = 500, showIndicators = true, autoPlay = true }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convertir le texte formaté en HTML
  const formatTextToHTML = (text) => {
    if (!text) return '';
    let html = text;
    html = html.replace(/###\s+(.+)/g, '<h3>$1</h3>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.+?)__/g, '<u>$1</u>');
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
      if (line.trim().startsWith('•')) {
        if (!inList) {
          inList = true;
          return '<ul><li>' + line.replace(/^•\s*/, '') + '</li>';
        }
        return '<li>' + line.replace(/^•\s*/, '') + '</li>';
      } else {
        if (inList) {
          inList = false;
          return '</ul>' + line;
        }
        return line;
      }
    });
    if (inList) processedLines.push('</ul>');
    html = processedLines.join('\n');
    html = html.replace(/\n/g, '<br>');
    return html;
  };

  // Fonction pour calculer le positionnement du contenu
  const getContentPositionStyle = (position) => {
    const styles = {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    };

    switch(position) {
      case 'top':
        styles.justifyContent = 'flex-start';
        break;
      case 'bottom':
        styles.justifyContent = 'flex-end';
        break;
      case 'left':
        styles.alignItems = 'flex-start';
        styles.textAlign = 'left';
        break;
      case 'right':
        styles.alignItems = 'flex-end';
        styles.textAlign = 'right';
        break;
      case 'top-left':
        styles.justifyContent = 'flex-start';
        styles.alignItems = 'flex-start';
        styles.textAlign = 'left';
        break;
      case 'top-right':
        styles.justifyContent = 'flex-start';
        styles.alignItems = 'flex-end';
        styles.textAlign = 'right';
        break;
      case 'bottom-left':
        styles.justifyContent = 'flex-end';
        styles.alignItems = 'flex-start';
        styles.textAlign = 'left';
        break;
      case 'bottom-right':
        styles.justifyContent = 'flex-end';
        styles.alignItems = 'flex-end';
        styles.textAlign = 'right';
        break;
      default:
        break;
    }

    return styles;
  };

  // Charger les slides depuis l'API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get('/api/carousel');
        if (response.data.slides && response.data.slides.length > 0) {
          // Filtrer les slides pour la page demandée
          const pageSlides = response.data.slides.filter(slide => slide.page === page);
          
          if (pageSlides.length > 0) {
            const formattedSlides = pageSlides.map(slide => ({
              ...slide,
              descriptionHTML: formatTextToHTML(slide.description || ''),
              description2HTML: formatTextToHTML(slide.description2 || ''),
              description3HTML: formatTextToHTML(slide.description3 || '')
            }));
            setSlides(formattedSlides);
          }
        }
      } catch (error) {
        console.log(`⚠️ Impossible de charger les slides pour ${page}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, [page]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="dynamic-carousel-loading" style={{ height: `${height}px` }}>
        <div className="spinner">⏳</div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (slides.length === 0) {
    return null; // Pas de carrousel si pas de slides
  }

  return (
    <div className="dynamic-carousel" style={{ height: `${height}px` }}>
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`dynamic-carousel-item${index === currentSlide ? ' active' : ''}`}
        >
          <div 
            className="dynamic-carousel-background"
            style={{
              backgroundImage: `url(/uploads/${slide.image})`,
              backgroundSize: slide.imageSize || 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div 
              className="dynamic-carousel-overlay"
              style={{
                background: `rgba(0,0,0,${(slide.overlayOpacity || 50) / 100})`,
                ...getContentPositionStyle(slide.contentPosition)
              }}
            >
              <div>
                {slide.title && <h2>{slide.title}</h2>}
                {slide.descriptionHTML && (
                  <div 
                    className="dynamic-carousel-description"
                    dangerouslySetInnerHTML={{ __html: slide.descriptionHTML }}
                  />
                )}
                {slide.description2HTML && (
                  <div 
                    className="dynamic-carousel-description"
                    dangerouslySetInnerHTML={{ __html: slide.description2HTML }}
                    style={{ marginTop: '15px' }}
                  />
                )}
                {slide.description3HTML && (
                  <div 
                    className="dynamic-carousel-description"
                    dangerouslySetInnerHTML={{ __html: slide.description3HTML }}
                    style={{ marginTop: '15px' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {showIndicators && slides.length > 1 && (
        <div className="dynamic-carousel-indicators">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicCarousel;
