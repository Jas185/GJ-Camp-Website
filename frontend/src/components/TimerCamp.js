import React, { useEffect, useState } from 'react';
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
  const endDate = '2026-08-19T00:00:00';
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDate));

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
        <span className="timer-modern-title">Camp GJ dans</span>
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
