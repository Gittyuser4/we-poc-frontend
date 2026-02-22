import React, { useState, useEffect } from 'react';

const LoadingSpinner: React.FC = () => {
  const gifs = [
    '/increase.gif',
    '/self-employed.gif',
    '/woman-working.gif',
    '/lifting.gif'
  ];

  const empoweringTexts = [
    'Empowering Women, Building Futures',
    'Your Voice Matters',
    'Together We Rise',
    'Strength in Unity'
  ];

  const [currentGifIndex, setCurrentGifIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGifIndex((prevIndex) => (prevIndex + 1) % gifs.length);
    }, 750); // 0.75 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-circle">
          <img
            src={gifs[currentGifIndex]}
            alt="Loading"
            className="loading-gif"
          />
        </div>
        <h3 className="loading-text">{empoweringTexts[currentGifIndex]}</h3>
      </div>
    </div>
  );
};

export default LoadingSpinner;
