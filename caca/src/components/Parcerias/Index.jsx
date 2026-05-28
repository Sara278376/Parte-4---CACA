import React, { useState, useEffect } from 'react';
import { parceriasList } from '../../data/parceriasData';
import './Parcerias.css';

export default function Parcerias() {
  const [index, setIndex] = useState(0);
  const imagens = parceriasList;

  useEffect(() => {
    if (imagens.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagens.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [imagens.length]);

  const plusSlides = (n) => {
    setIndex((prev) => (prev + n + imagens.length) % imagens.length);
  };

  if (imagens.length === 0) return null;

  return (
    <section id="Parcerias">
      <h1>Parcerias</h1>
      <div className="slideshow-container">
        {imagens.map((img, i) => (
          <div 
            key={i} 
            className={`mySlides fade ${i === index ? 'active' : ''}`}
            style={{ backgroundImage: `url('${img.url}')` }}
          >
            <div className="partner-logo-container">
              <img src={img.logo} alt={`Logotipo ${img.sigla}`} />
            </div>
            <div className="partner-text-container">
              <div className="text">{img.descricao}</div>
            </div>
          </div>
        ))}
        
        <button className="prev" onClick={() => plusSlides(-1)}>&#10094;</button>
        <button className="next" onClick={() => plusSlides(1)}>&#10095;</button>
      </div>

      <div className="dots-container">
        {imagens.map((_, i) => (
          <span 
            key={i} 
            className={`dot ${i === index ? 'active' : ''}`} 
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </section>
  );
}