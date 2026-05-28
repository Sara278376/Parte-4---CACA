import React, { useState } from 'react';
import Footer from './components/Footer/Index';
import Gestao_eventos from './components/Gestao_eventos/Index';
import GSAP from './components/GSAP/Index';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import Missao from './components/Missao/Missao';
import FormacaoEnsino from './components/FormacaoEnsino/FormacaoEnsino';
import Auth from './components/Auth/Auth';
import Parcerias from './components/Parcerias/Index';
import Noticias from './components/Noticias/Index';

import './App.css';

function App() {
  // Estado para o Modal
  const [modalAberto, setModalAberto] = useState(false);

  // Estado para o utilizador
  const [utilizador, setUtilizador] = useState(() => {
    const guardado = localStorage.getItem('utilizador');
    return guardado ? JSON.parse(guardado) : null;
  });

  // Atualiza estado após login
  function handleLogin(user) {
    setUtilizador(user);
    setModalAberto(false);
  }

  // Logout limpa local storage
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('utilizador');
    setUtilizador(null);
  }

  return (
    <div className="App">
      <header>
        <div className="header-container">
          <Header />
          <Menu />
          
          {/* Botão de Autenticação integrado no header */}
          <div className="auth-header-container">
            {utilizador ? (
              <div className="header-utilizador">
                <span>{utilizador.nome}</span>
                <button onClick={handleLogout}>Sair</button>
              </div>
            ) : (
              <button className="btn-login-header" onClick={() => setModalAberto(true)}>
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <GSAP> 
      <main>
      <Missao />
      <FormacaoEnsino />
      <Gestao_eventos />
      <Parcerias />
      <Noticias />
      </main>
      <Footer />
      </GSAP>

      {/* Modal de login/registo*/}
      {modalAberto && <Auth aoFechar={handleLogin} />}
    </div>
  );
}

export default App;