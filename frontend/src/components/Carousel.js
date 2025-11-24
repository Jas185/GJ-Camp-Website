import React, { useState, useEffect } from 'react';
import '../styles/App.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
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
  ];

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
    <div className="carousel">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="carousel-item"
          style={{
            display: index === currentSlide ? 'block' : 'none',
          }}
        >
          <img src={slide.image} alt={`Slide ${index + 1}`} />
          <div className="carousel-text">
            <h2>{slide.title}</h2>
            <p>{slide.date}</p>
            <button className="btn-primary">S'inscrire</button>
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
    </div>
  );
};

export default Carousel;
