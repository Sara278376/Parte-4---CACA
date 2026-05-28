import { useState, useEffect } from "react";
import "./Menu.css";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mostrarBtnTopo, setMostrarBtnTopo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarBtnTopo(document.documentElement.scrollTop > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      <label className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        &#9776;
      </label>
      <ul className={isOpen ? "aberto" : ""}>
        <li><a onClick={() => scrollToSection("missao")} href="#missao">Missão</a></li>
        <li><a onClick={() => scrollToSection("investigacao")} href="#investigacao">Formação e Ensino</a></li>
        <li><a onClick={() => scrollToSection("parcerias")} href="#parcerias">Parcerias</a></li>
        <li><a onClick={() => scrollToSection("conquistas")} href="#conquistas">Conquistas</a></li>
        <li><a onClick={() => scrollToSection("noticias")} href="#noticias">Notícias</a></li>
        <li><a onClick={() => scrollToSection("contactos")} href="#contactos">Contactos</a></li>
      </ul>

      {mostrarBtnTopo && (
        <button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </>
  );
}

export default Menu;