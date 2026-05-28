import { useEffect, useRef } from 'react';
import { initScrollAnimations, cleanupScrollAnimations } from './GSAP.js';

export default function GSAP({ children }) {
  // Container centralizador para gerir procura de elementos
  const containerRef = useRef(null);

  useEffect(() => {
    initScrollAnimations(containerRef.current);// executar lógica de animação

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