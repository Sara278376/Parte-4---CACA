import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function useGsap(selectors) {
  useEffect(() => {
    const elements = document.querySelectorAll(selectors);
    if (!elements.length) return;

    gsap.set(elements, { autoAlpha: 0 });

    elements.forEach((section) => {
      gsap.to(section, {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: section,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}

export default useGsap;