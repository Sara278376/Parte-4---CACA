import { useState, useEffect } from 'react';
import '../Footer.css';
import FormularioNewsletter from '../Formulario_newsletter/Index';
import Contactos from '../Contactos/Index';

export default function Footer() {
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  /**
   * Controla a visibilidade de um elemento com base na posição do scroll
   * @param {number} distancia - A distância em pixels do topo
   */
  useEffect(() => {
    const handleScroll = () => {
      if (document.documentElement.scrollTop > 150) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Esta função faz um scroll suave até ao topo da página
   */
  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="full_footer">
      <FormularioNewsletter />
      <Contactos />

      {showScrollBtn && (
        <button className="scroll-to-top" onClick={voltarAoTopo} style={{ display: "block" }}>
          <i className="fa fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
}