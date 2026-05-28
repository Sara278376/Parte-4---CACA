import React from 'react';
import Footer from './components/Footer/Index';
import Gestao_eventos from './components/Gestao_eventos/Index';
import GSAP from './components/GSAP/Index';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Missao from './components/Missao/Missao';
import FormacaoEnsino from './components/FormacaoEnsino/FormacaoEnsino';

import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <div className="header-container">
          <Header />
          <Menu />
        </div>
      </header>

      <GSAP> {/* Aplicacao de animação sobre o resto dos segmentos */}
        <main>
          <Missao />
          <FormacaoEnsino />
          <Gestao_eventos />
        </main>
        <Footer />
      </GSAP>
    </div>
  );
}

export default App;