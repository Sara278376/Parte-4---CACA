import { useState } from 'react';
import './Contactos.css';

export default function Contactos() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPrefixo, setSelectedPrefixo] = useState('+44');
  const [selectedFlag, setSelectedFlag] = useState('flag:gb-4x3');
  const [statusMsg, setStatusMsg] = useState({ visivel: false, texto: '', erro: false });
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    nome: '',
    email: '',
    tel: '',
    mensagem: ''
  });

  const paisesLista = [
    { nome: 'United Kingdom', prefixo: '+44', flag: 'flag:gb-4x3' },
    { nome: 'United States', prefixo: '+1', flag: 'flag:us-4x3' },
    { nome: 'Portugal', prefixo: '+351', flag: 'flag:pt-4x3' }
  ];

  const handleInputChange = (e) => {
    const { id, name, value } = e.target;
    const key = id || name;
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const selectQuickMessage = (e) => {
    const value = e.target.value;
    if (value) {
      setForm(prev => ({ ...prev, mensagem: value }));
    }
  };

  const handleSelectCountry = (prefixo, flag) => {
    setSelectedPrefixo(prefixo);
    setSelectedFlag(flag);
    setDropdownOpen(false);
    setSearchQuery('');
  };

  const handleSendEmail = () => {
    if (!form.nome || !form.email || !form.mensagem) {
      setStatusMsg({ visivel: true, texto: 'Erro ao enviar mensagem', erro: true });
      setTimeout(() => setStatusMsg(prev => ({ ...prev, visivel: false })), 3000);
      return;
    }

    setStatusMsg({ visivel: true, texto: 'Mensagem enviada com sucesso', erro: false });
    setForm({ nome: '', email: '', tel: '', mensagem: '' });
    setTimeout(() => setStatusMsg(prev => ({ ...prev, visivel: false })), 3000);
  };

  const paisesFiltrados = paisesLista.filter(p =>
    p.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <footer>
        <div id="Contactos"></div>
        <div className="footer-container">
          <div className="contactos">
            <h1>Contactos<br /></h1>
            <p>Email: 2acaca@uac.pt</p>
            <p>Telefone: 250 620 910</p>
            <p>Morada: Rua das Hortênsias Azuis 3, 9520-509 Lagoa</p>
          </div>
          <div className="email">
            <h1>Envie Um Email<br /> (*) obrigatório</h1>
            <div className="email-conteudo">
              <div className="email-campos">
                <input id="nome" type="text" value={form.nome} onChange={handleInputChange} placeholder="Nome*" />
                <input id="email" type="email" value={form.email} onChange={handleInputChange} placeholder="Email*" />
                
                <div className="select-box">
                  <div className="selected-option" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div>
                      <span className="iconify" data-icon={selectedFlag}></span>
                      <strong>{selectedPrefixo}</strong>
                    </div>
                    <input type="tel" name="tel" value={form.tel} onChange={handleInputChange} placeholder="Phone Number*" onClick={(e) => e.stopPropagation()} />
                  </div>
                  
                  <div className={`options ${dropdownOpen ? 'open' : ''}`}>
                    <input type="text" className="search-box" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Country Name" />
                    <ol>
                      {paisesFiltrados.map((p, idx) => (
                        <li key={idx} className="option" onClick={() => handleSelectCountry(p.prefixo, p.flag)}>
                          <div>
                            <span className="iconify" data-icon={p.flag}></span>
                            <span className="country-name">{p.nome}</span>
                          </div>
                          <strong>{p.prefixo}</strong>
                        </li>
                      ))}
                      {paisesFiltrados.length === 0 && (
                        <li style={{ padding: '0.6rem 1rem', color: '#808080', cursor: 'default' }}>Nenhum país encontrado</li>
                      )}
                    </ol>
                  </div>
                </div>

                <button id="enviar" onClick={handleSendEmail}>Enviar Mensagem</button>
              </div>
              
              <div className="mensagem-container">
                <select className="quick-message" id="quickMessage" onChange={selectQuickMessage}>
                  <option value="">Quick replies</option>
                  <option value="Gostaria de Saber se o projeto [proejeto] está disponível">Projetos de Investigação</option>
                  <option value="Gostaria de saber quais formações são oferecidas pelo centro">Formação e Ensino</option>
                  <option value="Estou interessado em realizar uma colobaroção com o CACA">Parcerias e Protocolos</option>
                  <option value="Gostaria de informar-me em como posso realizar os meus estudos no CACA">Apoio ao Estudante</option>
                </select>
                <textarea id="mensagem" maxLength={450} value={form.mensagem} onChange={handleInputChange} placeholder="Escreva a sua mensagem aqui... *"></textarea>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="direitos">
        <p>© 2026 Centro Académico Clinico dos Açores. Todos os direitos reservados.<br />
          Financiado pela Universidade dos Açores<br />
          https://fct.uac.pt/</p>
      </div>

      {statusMsg.visivel && (
        <div className={statusMsg.erro ? 'envio-erro' : 'envio-sucesso'} style={{ display: 'flex' }}>
          {statusMsg.texto}
        </div>
      )}
    </>
  );
}