import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Regista o plugin ScrollTrigger do GSAP para permitir animações baseadas no scroll
gsap.registerPlugin(ScrollTrigger);

/**
 * Inicializa e aplica as animações de ScrollTrigger aos elementos selecionados
 * dentro de um elemento pai (container).
 * * @param {HTMLElement} containerElement - O elemento DOM pai que contém as secções.
 */
export function initScrollAnimations(containerElement) {
  if (!containerElement) return;

  // Procura as secções alvo especificamente dentro do contexto do nosso container referenciado
  const sections = containerElement.querySelectorAll(
    '.missao, .objetivo, .investigacao-main, .slideshow-container, .conquistas, footer'
  );

  /**
   * Configuração inicial do estado dos elementos.
   * Define a propriedade autoAlpha como 0,
   * garantindo que as secções começam o carregamento da página invisíveis.
   */
  gsap.set(sections, { autoAlpha: 0 });

  /**
   * Aplica uma animação de "fade-in" individual a cada secção da lista.
   * A animação é controlada pelo scroll do utilizador, tornando o elemento visível
   * quando este entra na área de visualização (viewport).
   * * @param {HTMLElement} section - O elemento individual que será animado.
   * @param {Object} scrollTrigger - Configuração do gatilho de scroll.
   * @param {string} start - Define o ponto de ativação (quando o topo da secção chega a 100px do fundo).
   * @param {string} toggleActions - Define o comportamento (reproduz ao entrar, reverte ao sair por cima).
   */
  sections.forEach(function(section, index) {
    gsap.to(section, {
      autoAlpha: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse',
        // Garante que o GSAP calcula as posições sequencialmente de cima para baixo
        refreshPriority: sections.length - index,
      }
    });
  });
}

/**
 * Limpa e remove os gatilhos do ScrollTrigger da memória para evitar perdas de performance.
 */
export function cleanupScrollAnimations() {
  ScrollTrigger.getAll().forEach(function(trigger) {
    trigger.kill();
  });
}