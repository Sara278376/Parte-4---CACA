import { useState, useRef, useEffect } from "react";
import "./FormacaoEnsino.css";

const slides = [
  {
    img: "/imagens/investigacao/AI.png",
    alt: "Investigacao AI",
    data: "14 novembro 2025 - 12 dezembro 2025",
    titulo: "Inteligência Artificial em Saúde",
    texto: "Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.",
  },
  {
    img: "/imagens/investigacao/cirugia.png",
    alt: "Cirurgia",
    data: "14 novembro 2025 - 12 dezembro 2025",
    titulo: "Currículo de Trauma de Coluna",
    texto: "Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.",
  },
  {
    img: "/imagens/investigacao/saudeMental.png",
    alt: "Saude Mental em Estudantes Universitarios",
    data: "14 novembro 2025 - 12 dezembro 2025",
    titulo: "Saúde Mental em Estudantes Universitários",
    texto: "Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.",
  },
  {
    img: "/imagens/investigacao/primeirosSocorros.png",
    alt: "Primeiros Socorros",
    data: "14 novembro 2025 - 12 dezembro 2025",
    titulo: "Primeiros Socorros em Contexto Escolar",
    texto: "Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.",
  },
  {
    img: "/imagens/investigacao/reabilitacaoFisica.png",
    alt: "Reabilitacao Fisica",
    data: "14 novembro 2025 - 12 dezembro 2025",
    titulo: "Reabilitação Física Pós-Cirúrgica",
    texto: "Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.",
  },
];

function getVisibleCount() {
  if (window.innerWidth <= 980) return 1;
  if (window.innerWidth <= 1350) return 2;
  return 3;
}

function FormacaoEnsino() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [abertos, setAbertos] = useState(Array(slides.length).fill(false));
  const trackRef = useRef(null);

  const updateSlider = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll(".investigacao-contentor");
    if (!cards.length) return;
    const visible = getVisibleCount();
    const maxIndex = cards.length - visible;
    let newIndex = index;
    if (newIndex < 0) newIndex = maxIndex;
    if (newIndex > maxIndex) newIndex = 0;
    setCurrentIndex(newIndex);
    const card = cards[0];
    const style = window.getComputedStyle(card);
    const cardWidth =
      card.offsetWidth +
      parseInt(style.marginLeft) +
      parseInt(style.marginRight);
    track.style.transform = `translateX(-${newIndex * cardWidth}px)`;
  };

  useEffect(() => {
    const handleResize = () => updateSlider(currentIndex);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

  const toggleSaberMais = (index) => {
    setAbertos((prev) => {
      const novo = [...prev];
      novo[index] = !novo[index];
      return novo;
    });
  };

  return (
    <section id="investigacao">
      <h1>Formação e Ensino</h1>
      <div
        className="investigacao-main"
        style={{ backgroundImage: "url('/imagens/missao-objetivo/paisagem2.png')" }}
      >
        <button className="prev" onClick={() => updateSlider(currentIndex - 1)}>
          &#10094;
        </button>
        <div className="investigacao-viewport">
          <div className="investigacao-track" ref={trackRef}>
            {slides.map((slide, i) => (
              <div className="investigacao-contentor" key={i}>
                <img src={slide.img} alt={slide.alt} />
                <p>{slide.data}</p>
                <h2>{slide.titulo}</h2>
                <p
                  className="saberTexto"
                  style={{ display: abertos[i] ? "block" : "none" }}
                >
                  {slide.texto}
                </p>
                <button onClick={() => toggleSaberMais(i)}>
                  {abertos[i] ? "Fechar" : "Saber Mais"}
                </button>
              </div>
            ))}
          </div>
        </div>
        <button className="next" onClick={() => updateSlider(currentIndex + 1)}>
          &#10095;
        </button>
      </div>
    </section>
  );
}

export default FormacaoEnsino;