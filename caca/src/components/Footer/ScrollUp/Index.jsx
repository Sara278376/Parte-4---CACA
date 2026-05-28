import { useEffect, useRef } from 'react';
import './ScrollUp.css';

export default function ScrollUp() {
  const btnScrollRef = useRef(null);

  /**
   * Controla a visibilidade de um elemento com base na posição do scroll
   * @param {HTMLElement} elemento - O elemento a mostrar/esconder
   * @param {number} distancia - A distância em pixels do topo
   */
  function atualizarVisibilidadeScroll(elemento, distancia) {
      if (document.documentElement.scrollTop > distancia) {
          elemento.style.display = "block";
      } else {
          elemento.style.display = "none";
      }
  }

  /**
   * Esta função faz um scroll suave até ao topo da página
   */
  function voltarAoTopo() { window.scrollTo({ top: 0, behavior: "smooth" }); }

  useEffect(() => {
    const btnScroll = btnScrollRef.current;
    if (!btnScroll) return;

    /**
     * * @param {event} scroll - evento de scroll
     */
    const handleScroll = function() {
      atualizarVisibilidadeScroll(btnScroll, 150);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return ( // Previous html code for button transfered here instead of main script
    <button 
    ref={btnScrollRef}
    className="scroll-to-top" 
    onClick={voltarAoTopo}
    style={{ display: "none" }}
>   
    <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
}