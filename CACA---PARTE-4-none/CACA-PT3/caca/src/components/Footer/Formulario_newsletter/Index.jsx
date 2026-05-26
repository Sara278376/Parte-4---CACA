import { useState, useEffect } from 'react';
import './FormularioNewsletter.css';
import { abrirNewsletterDB, verificarEmailExiste, adicionarSubscritor } from '../../../components/IndexedDB_API/indexeddb';

export default function FormularioNewsletter() {
  const [botaoDesativado, setBotaoDesativado] = useState(false);
  const [textoBotao, setTextoBotao] = useState('Subscrever');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState({ texto: '', classe: '' });

  useEffect(() => {
    abrirNewsletterDB().catch(err => {
      console.error('Falha ao abrir IndexedDB da newsletter:', err);
      setBotaoDesativado(true);
      setTextoBotao('Serviço indisponível');
      setFeedback({
        texto: '❌ Não foi possível inicializar o sistema de subscrição.',
        classe: 'newsletter-feedback--erro'
      });
    });
  }, []);

  const validarEmail = (val) => /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/.test(val.trim());
  const validarNome = (val) => val.trim().length >= 2;

  const handleSubmeter = async () => {
    if (!validarNome(nome)) {
      setFeedback({ texto: '❌ Introduz um nome válido (mínimo 2 caracteres).', classe: 'newsletter-feedback--erro' });
      return;
    }

    if (!validarEmail(email)) {
      setFeedback({ texto: '❌ O endereço de e-mail introduzido não é válido.', classe: 'newsletter-feedback--erro' });
      return;
    }

    try {
      const jaExiste = await verificarEmailExiste(email);
      if (jaExiste) {
        setFeedback({ texto: '⚠️ Este e-mail já está subscrito na nossa newsletter.', classe: 'newsletter-feedback--erro' });
        return;
      }

      const subscritor = {
        nome: nome.trim(),
        email: email.trim(),
        dataSubscricao: new Date().toISOString()
      };

      await adicionarSubscritor(subscritor);

      setNome('');
      setEmail('');
      setFeedback({ texto: `✅ Obrigado, ${nome.trim()}! A subscrição foi realizada com sucesso.`, classe: 'newsletter-feedback--sucesso' });

      setTimeout(() => {
        setFeedback({ texto: '', classe: '' });
      }, 4000);

    } catch (err) {
      if (err.name === 'ConstraintError') {
        setFeedback({ texto: '⚠️ Este e-mail já está subscrito na nossa newsletter.', classe: 'newsletter-feedback--erro' });
      } else {
        console.error('Erro ao guardar subscrição:', err);
        setFeedback({ texto: '❌ Não foi possível guardar a subscrição. Tenta novamente.', classe: 'newsletter-feedback--erro' });
      }
    }
  };

  return (
    <div id="Newsletter">
      <section className="newsletter">
        <div className="newsletter-conteudo">
          <div className="newsletter-texto">
            <h2>Fique Informado</h2>
            <p>Subscreva a nossa newsletter e receba novidades sobre formações, investigação e eventos do CACA diretamente no seu e-mail.</p>
          </div>
          <div className="newsletter-formulario">
            {feedback.texto && (
              <div className={`newsletter-feedbaxck newsletter-feedback ${feedback.classe}`} style={{ display: 'block' }}>
                {feedback.texto}
              </div>
            )}
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome *" maxLength={80} autoComplete="given-name" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail *" maxLength={120} autoComplete="email" />
            <button onClick={handleSubmeter} disabled={botaoDesativado}>{textoBotao}</button>
          </div>
        </div>
      </section>
    </div>
  );
}