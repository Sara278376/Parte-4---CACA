// ============================================================
// Comunica com o backend em http://localhost:5000/api/auth
// ============================================================

import { useState } from 'react';
import './Auth.css';

/**
 * Componente modal de autenticação.
 * Props:
 *  - aoFechar: função chamada quando o modal é fechado
 * Funcionalidades:
 *  - Alterna entre modo 'login' e modo 'registo'
 *  - Envia os dados para a API backend
 *  - Em login: guarda o token e dados do utilizador no localStorage
 *  - Em registo: cria a conta e redireciona para login
 */
export default function Auth({ aoFechar }) {
  const [modo, setModo] = useState('login'); // Controla se mostra login ou registo
  const [formDados, setFormDados] = useState({ nome: '', email: '', password: '' });
  const [mensagem, setMensagem] = useState({ texto: '', erro: false });
  const [carregando, setCarregando] = useState(false);

  // Atualiza o estado do formulário ao escrever
  function handleChange(e) {
    const { name, value } = e.target;
    setFormDados(prev => ({ ...prev, [name]: value }));
  }

  /**
   * Submete o formulário para a API.
   * - Login: recebe token JWT e dados do utilizador
   * - Registo: cria conta e muda para modo login
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ texto: '', erro: false });

    // Escolhe o endpoint consoante o modo
    const endpoint = modo === 'login' ? '/api/auth/login' : '/api/auth/register';

    // Corpo do pedido — registo precisa também do nome
    const body = modo === 'login'
      ? { email: formDados.email, password: formDados.password }
      : { nome: formDados.nome, email: formDados.email, password: formDados.password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const dados = await res.json();

      if (!res.ok) {
        // Mostra o erro devolvido pela API
        setMensagem({ texto: dados.erro || 'Ocorreu um erro.', erro: true });
      } else if (modo === 'login') {
        // Guarda o token e dados do utilizador para uso posterior
        localStorage.setItem('token', dados.token);
        localStorage.setItem('utilizador', JSON.stringify(dados.utilizador));
        setMensagem({ texto: `Bem-vindo, ${dados.utilizador.nome}!`, erro: false });
        setTimeout(() => aoFechar(dados.utilizador), 1000); // Fecha modal após 1 segundo
      } else {
        // Registo bem-sucedido — muda para modo login
        setMensagem({ texto: 'Conta criada com sucesso! Podes fazer login.', erro: false });
        setModo('login');
        setFormDados({ nome: '', email: '', password: '' });
      }
    } catch {
      setMensagem({ texto: 'Erro ao ligar ao servidor.', erro: true });
    } finally {
      setCarregando(false);
    }
  }

  return (
    // Clique fora do modal fecha-o
    <div className="auth-overlay" onClick={aoFechar}>
      {/* stopPropagation evita que o clique dentro do modal o feche */}
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-fechar" onClick={aoFechar}>✕</button>

        <h2>{modo === 'login' ? 'Iniciar Sessão' : 'Criar Conta'}</h2>

        {/* Mensagem de feedback (erro ou sucesso) */}
        {mensagem.texto && (
          <div className={`auth-msg ${mensagem.erro ? 'auth-msg-erro' : 'auth-msg-sucesso'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Campo de nome só aparece no registo */}
          {modo === 'registo' && (
            <input
              type="text"
              name="nome"
              placeholder="Nome *"
              value={formDados.nome}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formDados.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formDados.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-btn-submit" disabled={carregando}>
            {carregando ? 'A processar…' : (modo === 'login' ? 'Entrar' : 'Registar')}
          </button>
        </form>

        {/* Link para alternar entre login e registo */}
        <p className="auth-trocar">
          {modo === 'login' ? 'Ainda não tens conta?' : 'Já tens conta?'}
          <button onClick={() => { setModo(modo === 'login' ? 'registo' : 'login'); setMensagem({ texto: '', erro: false }); }}>
            {modo === 'login' ? ' Registar' : ' Iniciar sessão'}
          </button>
        </p>
      </div>
    </div>
  );
}