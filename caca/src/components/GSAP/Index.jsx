import { useEffect, useRef } from 'react';
import { initScrollAnimations, cleanupScrollAnimations } from './GSAP.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function GSAP({ children }) {
  // Container centralizador para gerir procura de elementos
  const containerRef = useRef(null);

  useEffect(() => {
    initScrollAnimations(containerRef.current);// executar lógica de animação
    
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupScrollAnimations();
    };
  }, [children]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}