import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/App.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    // Slides par défaut si l'API ne répond pas
    {
      image: '/images/photoTest.jpg',
      title: 'Le camp GJ, des moments inoubliables, de nouvelles rencontres, des instants de partages, ne le rate pas.',
      date: 'C\'est du 08/08/2026 au 11/08/2026.',
    },
    {
      image: '/images/photoTest2.jpg',
      title: 'Rejoignez-nous pour une expérience unique!',
      date: 'Dates: 08/08/2026 - 11/08/2026',
    },
    {
      image: '/images/photoTest3.jpg',
      title: 'Des souvenirs qui dureront toute une vie',
      date: 'Dates: 08/08/2026 - 11/08/2026',
    },
    {
      image: '/images/_DSC9308.jpg',
      title: 'Vivez l\'expérience du fellowship!',
      date: 'Dates: 08/08/2026 - 11/08/2026',
    },
    {
      image: '/images/_DSC9762.jpg',
      title: 'Ensemble, c\'est meilleur!',
      date: 'Dates: 08/08/2026 - 11/08/2026',
    },
  ]);

  // Convertir le texte formaté en HTML
  const formatTextToHTML = (text) => {
    if (!text) return '';
    let html = text;
    // Titres (###)
    html = html.replace(/###\s+(.+)/g, '<h3>$1</h3>');
    // Gras (**)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italique (*)
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Souligné (__)
    html = html.replace(/__(.+?)__/g, '<u>$1</u>');
    // Liens ([texte](url))
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
    // Listes à puces (•)
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
    // Retours à la ligne
    html = html.replace(/\n/g, '<br>');
    return html;
  };

  // Charger les slides depuis l'API
  useEffect(() => {
    const fetchCarouselSlides = async () => {
      try {
        const response = await axios.get('/api/carousel');
        if (response.data.slides && response.data.slides.length > 0) {
          // Filtrer les slides pour la page d'accueil uniquement
          const homeSlides = response.data.slides.filter(slide => slide.page === 'home' || !slide.page);
          
          if (homeSlides.length > 0) {
            // Transformer les slides de l'API au format attendu
            const apiSlides = homeSlides.map(slide => ({
              image: `/uploads/${slide.image}`,
              title: slide.title || 'Camp GJ 2026',
              date: slide.description || 'Dates: 08/08/2026 - 11/08/2026',
              descriptionHTML: formatTextToHTML(slide.description || ''),
              imageSize: slide.imageSize || 'cover'
            }));
            setSlides(apiSlides);
            console.log('✅ Slides du carrousel chargées depuis l\'API:', apiSlides.length);
          }
        }
      } catch (error) {
        console.log('⚠️ Utilisation des slides par défaut');
      }
    };
    fetchCarouselSlides();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="carousel" style={{position: 'relative', minHeight: 680}}>
      <div className="carousel-title-overlay carousel-title-left">
        <h1 className="carousel-main-title">{slides[currentSlide]?.title || 'CAMP GJ'}</h1>
        {slides[currentSlide]?.descriptionHTML ? (
          <div 
            className="carousel-subtitle-text carousel-subtitle-no-bg carousel-formatted-text"
            dangerouslySetInnerHTML={{ __html: slides[currentSlide].descriptionHTML }}
          />
        ) : (
          <p className="carousel-subtitle-text carousel-subtitle-no-bg">
            {slides[currentSlide]?.date || 'Nous sommes une génération puissante et remplie du Saint-Esprit.'}
          </p>
        )}
      </div>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-item${index === currentSlide ? ' active' : ''}`}
        >
          <div style={{position: 'relative', width: '100%', height: '100%', minHeight: 680}}>
            <div
              className="carousel-background"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: slide.imageSize || 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
                minHeight: 680,
              }}
            />
            <div className="carousel-overlay" />
          </div>
        </div>
      ))}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
      <div className="carousel-inscription-btn">
        <a href="/inscription">
          <button className="btn-primary btn-large">S'inscrire au camp</button>
        </a>
      </div>
    </div>
  );
};

export default Carousel;
