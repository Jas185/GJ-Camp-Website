import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/App.css';

const getTimeRemaining = (endDate) => {
  const total = Date.parse(endDate) - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

const TimerCamp = () => {
  const [endDate, setEndDate] = useState('2026-08-19T00:00:00');
  const [title, setTitle] = useState('Camp GJ dans');
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining('2026-08-19T00:00:00'));

  // Charger les paramètres depuis l'API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data.success && response.data.settings) {
          const newEndDate = response.data.settings.countdownDate || '2026-08-19T00:00:00';
          const newTitle = response.data.settings.countdownTitle || 'Camp GJ dans';
          setEndDate(newEndDate);
          setTitle(newTitle);
          setTimeLeft(getTimeRemaining(newEndDate));
        }
      } catch (error) {
        console.log('⚠️ Impossible de charger les paramètres du compte à rebours, utilisation des valeurs par défaut');
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.total <= 0) {
    return <div className="timer-camp">⏰ Le camp a commencé !</div>;
  }

  return (
    <div className="timer-camp timer-camp-modern">
      <div className="timer-modern-row">
        <span className="timer-modern-title">{title}</span>
        <span className="timer-modern-value">{timeLeft.days}<span className="timer-modern-unit">j</span></span>
        <span className="timer-modern-sep">:</span>
        <span className="timer-modern-value">{String(timeLeft.hours).padStart(2, '0')}<span className="timer-modern-unit">h</span></span>
        <span className="timer-modern-sep">:</span>
        <span className="timer-modern-value">{String(timeLeft.minutes).padStart(2, '0')}<span className="timer-modern-unit">m</span></span>
      </div>
    </div>
  );
};

export default TimerCamp;
