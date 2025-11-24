import React from 'react';
import Carousel from '../components/Carousel';
import '../styles/App.css';

const HomePage = () => {
  return (
    <div className="container">
      <div className="hero">
        <Carousel />
      </div>
    </div>
  );
};

export default HomePage;
