import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const listaObjetivos = [
  { id: 1, icone: '🔬', texto: 'Promover a investigação científica na área da saúde.' },
  { id: 2, icone: '🎓', texto: 'Apoiar a formação de profissionais de saúde qualificados.' },
  { id: 3, icone: '🤝', texto: 'Estabelecer parcerias com instituições nacionais e internacionais.' },
  { id: 4, icone: '💡', texto: 'Fomentar a inovação e transferência de conhecimento.' },
  { id: 5, icone: '🌍', texto: 'Contribuir para o desenvolvimento sustentável dos Açores.' },
];

function Objetivos() {
  const secaoRef = useRef(null);
  const tituloRef = useRef(null);
  const itensRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      tituloRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: secaoRef.current, start: 'top 80%' }
      }
    );

    // Animação escalonada nos cartões
    gsap.fromTo(
      itensRef.current,
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: { trigger: secaoRef.current, start: 'top 70%' }
      }
    );
  }, []);

  return (
    <section id="objetivos" ref={secaoRef} className="objetivos">
      <h2 ref={tituloRef} className="objetivos__titulo">Objetivos</h2>
      <ul className="objetivos__lista">
        {listaObjetivos.map((obj, index) => (
          <li
            key={obj.id}
            className="objetivos__item"
            ref={(el) => (itensRef.current[index] = el)}
          >
            <span className="objetivos__icone">{obj.icone}</span>
            <p className="objetivos__texto">{obj.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Objetivos;