import { useEffect, useRef } from 'react';
import { initScrollAnimations, cleanupScrollAnimations } from './GSAP.js';

export default function GSAP({ children }) {
  // Container centralizador para gerir e isolar a procura de elementos no DOM do React
  const containerRef = useRef(null);

  useEffect(() => {
    // Executa a lógica de animação passando o elemento atual do DOM obtido via ref
    initScrollAnimations(containerRef.current);

    // Remove os gatilhos de memória quando o utilizador muda de página para evitar perdas de performance
    return () => {
      cleanupScrollAnimations();
    };
  }, []);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}