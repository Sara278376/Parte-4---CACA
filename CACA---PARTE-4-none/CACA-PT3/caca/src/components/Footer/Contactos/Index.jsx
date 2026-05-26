import { useState } from 'react';
import './Contactos.css';
import { countries } from './media/data/paises';

/**
 * A função verifica se o email está num formato aceitavel
 * através de um regex, no qual verifica se
 * tem um texto de inicio, um @(algo).com
 * @param {string} email 
 * @returns boolean
 */
function validateEmail(email) {
  return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g);
}

/**
 * A função verifica se o número de telefone está num formato
 * valido
 * @param {string} phone 
 * @returns boolean
 */
function validatePhone(phone) {
    const digitos = phone.replace(/[\s\-\(\)\+]/g, '').trim();
    return /^\d{7,15}$/.test(digitos);
}

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

  const handleInputChange = (e) => {
    const { id, name, value } = e.target;
    const key = id || name;
    setForm(prev => ({ ...prev, [key]: value }));
  };

  /**
   * @param {object} e - evento de mudança do select
   */
  const selectQuickMessage = (e) => { // Modificado de forma a aceder ao element chamado, em vez de utilizar getElementById
    const quickMessageEl = e.target;
    
    if (quickMessageEl.value) {
      setForm(prev => ({ 
        ...prev, 
        mensagem: quickMessageEl.value 
      }));
    }
  };

  const handleSelectCountry = (prefixo, flag) => {
    setSelectedPrefixo(prefixo);
    setSelectedFlag(flag);
    setDropdownOpen(false);
    setSearchQuery('');
  };

  /**
   * A função verifica se o utilizador tem todos os parametros do formulário preenchidos, estes sendo
   * o nome, email e mensagem. Em caso de falha é exposto no ecrã uma mensagem de erro, indicando o
   * parametro não preenchido ou inválido. Caso estejam em um formato aceitavel, é exposto ao
   * utiliador uma mensagem de sucesso
   */
  const handleSendEmail = () => {
    if (form.nome == ""){
        setStatusMsg({ visivel: true, texto: "Erro: Nome inválido", erro: true });
        setTimeout(function(){
          setStatusMsg(prev => ({ ...prev, visivel: false }));
        } , 3000);
    }
    
    else if (form.email == "" || !validateEmail(form.email)){
        setStatusMsg({ visivel: true, texto: "Erro: Email Inválido", erro: true });
        setTimeout(function(){
          setStatusMsg(prev => ({ ...prev, visivel: false }));
        } , 3000);
    }
    else if (form.mensagem == ""){
        setStatusMsg({ visivel: true, texto: "Erro: Mensagem vazia", erro: true });
        setTimeout(function(){
          setStatusMsg(prev => ({ ...prev, visivel: false }));
        } , 3000);
    }

    else if (!validatePhone(form.tel)){
        setStatusMsg({ visivel: true, texto: "Erro: Telefone Inválido", erro: true });
        setTimeout(function(){
          setStatusMsg(prev => ({ ...prev, visivel: false }));
        } , 3000);
    }
    else{
        setStatusMsg({ visivel: true, texto: "Mensagem enviada com sucesso", erro: false });
        setForm({ nome: '', email: '', tel: '', mensagem: '' });
        setTimeout(function(){
          setStatusMsg(prev => ({ ...prev, visivel: false }));
        } , 3000);
    }
  };

  const paisesFiltrados = countries.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                        <li key={idx} className="option" onClick={() => handleSelectCountry(`+${p.phone}`, `flag:${p.code.toLowerCase()}-4x3`)}>
                          <div>
                            <span className="iconify" data-icon={`flag:${p.code.toLowerCase()}-4x3`}></span>
                            <span className="country-name">{p.name}</span>
                          </div>
                          <strong>+{p.phone}</strong>
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