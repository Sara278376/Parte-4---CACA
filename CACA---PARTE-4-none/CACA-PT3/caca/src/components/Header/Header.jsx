import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Header.css";

function Header() {
  const logotipoRef = useRef(null);
  const logotipoMobileRef = useRef(null);
  const logosAtivos = useRef([]);

  const getDims = (el, wP, hP) => ({
    w: el.getBoundingClientRect().width || wP,
    h: el.getBoundingClientRect().height || hP,
  });

  const criarRenderer = (comprimento, altura) => {
    const r = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    r.setPixelRatio(window.devicePixelRatio);
    r.setSize(comprimento, altura);
    r.domElement.style.display = "block";
    return r;
  };

  const setLogo = (ctx, url) => {
    new THREE.TextureLoader().load(url, (tex) => {
      const geometry = new THREE.PlaneGeometry(
        (tex.image.width / tex.image.height) * 1.5,
        1.5
      );
      const material = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
      });
      if (ctx.mesh) ctx.scene.remove(ctx.mesh);
      ctx.mesh = new THREE.Mesh(geometry, material);
      ctx.scene.add(ctx.mesh);
    });
  };

  const initLogo = (el, img, width, height) => {
    if (!el) return null;
    const dimensao = getDims(el, width, height);
    const ctx = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(45, dimensao.w / dimensao.h, 0.1, 1000),
      renderer: criarRenderer(dimensao.w, dimensao.h),
      mesh: null,
      el,
      wP: width,
      hP: height,
    };
    ctx.camera.position.z = 3;
    ctx.scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    el.replaceChildren(ctx.renderer.domElement);
    setLogo(ctx, img);
    logosAtivos.current.push(ctx);
    return ctx;
  };

  useEffect(() => {
    const principal = initLogo(
      logotipoRef.current,
      "/imagens/logotipos/logotipo.png",
      334,
      128
    );

    initLogo(
      logotipoMobileRef.current,
      "/imagens/logotipos/logotipo-mobile.png",
      60,
      70
    );

    // Loop de animação
    let animId;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      logosAtivos.current.forEach((element) => {
        if (element.mesh) element.mesh.rotation.y += 0.015;
        element.renderer.render(element.scene, element.camera);
      });
    };
    loop();

    // Breakpoint tablet
    const mq = window.matchMedia("(max-width: 1350px)");
    const swap = (e) => {
      if (principal) {
        setLogo(
          principal,
          e.matches
            ? "/imagens/logotipos/logotipo_tablet.png"
            : "/imagens/logotipos/logotipo.png"
        );
      }
    };
    mq.addEventListener("change", swap);
    swap(mq);

    // Resize
    const handleResize = () => {
      logosAtivos.current.forEach((element) => {
        const d = getDims(element.el, element.wP, element.hP);
        element.camera.aspect = d.w / d.h;
        element.camera.updateProjectionMatrix();
        element.renderer.setSize(d.w, d.h);
      });
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      mq.removeEventListener("change", swap);
      window.removeEventListener("resize", handleResize);
      logosAtivos.current.forEach((element) => {
        element.renderer.dispose();
      });
      logosAtivos.current = [];
    };
  }, []);

  return (
    <div className="header-logo">
      <div className="logotipo" ref={logotipoRef}></div>
      <div className="logotipo-mobile" ref={logotipoMobileRef}></div>
    </div>
  );
}

export default Header;