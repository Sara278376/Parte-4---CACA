import './Gestao_eventos.css';
import { useState, useEffect } from 'react';
import {
  abrirDB,
  geAdicionarEvento,
  geRemoverEvento,
  geListarEventos,
  geGeocodificar,
  geObterMeteo,
  geInterpretarWMO,
  geMostrarMapa
} from '../IndexedDB_API/indexeddb.js';

export default function Gestao_eventos() {
  const [eventos, setEventos] = useState([]);
  const [activeTab, setActiveTab] = useState('meteo');
  const [painelVisivel, setPainelVisivel] = useState(false);
  const [cacheGeo, setCacheGeo] = useState(null);

  const [feedbackMsg, setFeedbackMsg] = useState({ texto: '', classe: '' });
  const [meteoErro, setMeteoErro] = useState('');

  const [formDados, setFormDados] = useState({
    titulo: '',
    descricao: '',
    data: '',
    hora: '',
    local: ''
  });

  const [meteoDados, setMeteoDados] = useState({
    carregando: false,
    visivel: false,
    aviso: '',
    icon: '🌡️',
    temp: '--°C',
    desc: '--',
    maxmin: '-- / --',
    precip: '--',
    vento: '--',
    humidade: '--',
    uv: '--',
    sol: '--'
  });

  const [mapaInfoTexto, setMapaInfoTexto] = useState('');

  useEffect(() => {
    abrirDB()
      .then(() => {
        carregarERenderizarEventos();
      })
      .catch(err => {
        setFeedbackMsg({
          texto: 'Erro ao inicializar a base de dados. Abre a consola do browser.',
          classe: 'ge-erro'
        });
        console.error('Falha ao abrir IndexedDB:', err);
      });
  }, []);

  const carregarERenderizarEventos = async () => {
    const dados = await geListarEventos();
    dados.sort((a, b) => a.data.localeCompare(b.data));
    setEventos(dados);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDados(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardarEvento = async (e) => {
    e.preventDefault();
    const { titulo, descricao, data, hora, local } = formDados;

    if (!titulo || !descricao || !data || !hora || !local) {
      setFeedbackMsg({ texto: 'Preenche todos os campos obrigatórios.', classe: 'ge-erro' });
      return;
    }

    const hoje = new Date().toISOString().split('T')[0];
    if (data < hoje) {
      setFeedbackMsg({ texto: 'A data do evento deve ser hoje ou uma data futura.', classe: 'ge-erro' });
      return;
    }

    await geAdicionarEvento({ titulo, descricao, data, hora, local });
    setFeedbackMsg({ texto: '✅ Evento adicionado com sucesso!', classe: 'ge-sucesso' });
    
    setFormDados({ titulo: '', descricao: '', data: '', hora: '', local: '' });
    setCacheGeo(null);
    carregarERenderizarEventos();

    setTimeout(() => setFeedbackMsg({ texto: '', classe: '' }), 3000);
  };

  const handlePesquisarLocal = async () => {
    const { local, data: dataEvento, hora, titulo } = formDados;

    if (!local.trim()) {
      setFeedbackMsg({ text: 'Introduz um local antes de pesquisar.', classe: 'ge-erro' });
      return;
    }
    if (!dataEvento) {
      setFeedbackMsg({ texto: 'Seleciona uma data para ver a previsão meteorológica.', classe: 'ge-erro' });
      return;
    }

    setPainelVisivel(true);
    setFeedbackMsg({ texto: 'A pesquisar localização…', classe: 'ge-sucesso' });

    try {
      let lat, lon, nome;
      if (!cacheGeo || cacheGeo.query !== local.trim()) {
        const geoRes = await geGeocodificar(local.trim());
        lat = geoRes.lat;
        lon = geoRes.lon;
        nome = geoRes.nome;
        setCacheGeo({ query: local.trim(), lat, lon, nome });
      } else {
        lat = cacheGeo.lat;
        lon = cacheGeo.lon;
        nome = cacheGeo.nome;
      }

      setFeedbackMsg({ texto: '', classe: '' });
      setMeteoErro('');

      setMeteoDados(prev => ({ ...prev, carregando: true, visivel: false, aviso: '' }));
      const resMeteo = await geObterMeteo(lat, lon);
      const dias = resMeteo.daily.time;
      const idx = dias.indexOf(dataEvento);

      if (idx === -1) {
        setMeteoDados(prev => ({ ...prev, carregando: false }));
        const [ano, mes, dia] = dataEvento.split('-');
        setMeteoErro(`⚠️ A data do evento (${dia}/${mes}/${ano}) está além do horizonte de previsão de 16 dias. Consulta novamente mais perto do evento.`);
        return;
      }

      const d = resMeteo.daily;
      const wmo = geInterpretarWMO(d.weathercode[idx]);
      const formatHora = (isoStr) => isoStr ? isoStr.substring(11, 16) : '--';

      setMeteoDados({
        carregando: false,
        visivel: true,
        aviso: d.precipitation_sum[idx] >= 5 ? `⛈️ Atenção: espera-se precipitação de ${d.precipitation_sum[idx]} mm neste dia. Considera um plano de contingência.` : '',
        icon: wmo.emoji,
        temp: `${Math.round((d.temperature_2m_max[idx] + d.temperature_2m_min[idx]) / 2)}°C`,
        desc: `${wmo.desc} · ${nome.split(',')[0]}`,
        maxmin: `${d.temperature_2m_max[idx]}°C / ${d.temperature_2m_min[idx]}°C`,
        precip: `${d.precipitation_sum[idx]} mm`,
        vento: `${d.windspeed_10m_max[idx]} km/h`,
        humidade: d.relative_humidity_2m_max ? `${d.relative_humidity_2m_max[idx]}%` : 'N/D',
        uv: d.uv_index_max[idx] ?? 'N/D',
        sol: `${formatHora(d.sunrise[idx])} / ${formatHora(d.sunset[idx])}`
      });

      geMostrarMapa('ge-mapa-contentor', lat, lon, nome, titulo, dataEvento, hora);
      setMapaInfoTexto(`<strong>Localização encontrada:</strong> ${nome.split(',').slice(0, 3).join(',')} · <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}" target="_blank" rel="noopener">Abrir no OpenStreetMap ↗</a>`);

      setTimeout(function() {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 200);

    } catch (err) {
      setFeedbackMsg({ texto: '❌ ' + err.message, classe: 'ge-erro' });
      setMeteoDados(prev => ({ ...prev, carregando: false }));
    }
  };

  const handleEliminarEvento = async (id) => {
    if (!window.confirm('Tens a certeza que queres remover este evento?')) return;
    await geRemoverEvento(id);
    setFeedbackMsg({ texto: 'Evento removido.', classe: 'ge-sucesso' });
    carregarERenderizarEventos();
    setTimeout(() => setFeedbackMsg({ texto: '', classe: '' }), 3000);
  };

  return (
    <div className="ge-main-container">
      <div id="Eventos" className="scroll-anchor"></div>
      <section className="ge-secao">
        <div className="ge-secao-header">
          <span>Gestão de Eventos</span>
        </div>

        <div className="ge-page-wrap">
          <div className="ge-card">
            <h2>Adicionar Evento</h2>
            
            {feedbackMsg.texto && (
              <div className={`ge-msg-feedback ${feedbackMsg.classe}`}>
                {feedbackMsg.texto}
              </div>
            )}

            <div className="ge-form-grid">
              <input type="text" name="titulo" value={formDados.titulo} onChange={handleInputChange} placeholder="Título do evento *" required />
              <textarea name="descricao" value={formDados.descricao} onChange={handleInputChange} placeholder="Descrição *" required />
              
              <div className="ge-form-row">
                <input type="date" name="data" value={formDados.data} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} required />
                <input type="time" name="hora" value={formDados.hora} onChange={handleInputChange} required />
              </div>
              
              <input type="text" name="local" value={formDados.local} onChange={handleInputChange} placeholder="Local (cidade, endereço) *" required />
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="ge-btn ge-btn-primary" onClick={handleGuardarEvento}>Guardar Evento</button>
              <button className="ge-btn ge-btn-secondary" onClick={handlePesquisarLocal}>Ver Local + Meteorologia</button>
            </div>

            {painelVisivel && (
              <div id="ge-painel-api">
                <div className="ge-api-tabs">
                  <button className={`ge-tab-btn ${activeTab === 'meteo' ? 'ativo' : ''}`} onClick={() => setActiveTab('meteo')}>🌤️ Meteorologia</button>
                  <button className={`ge-tab-btn ${activeTab === 'mapa' ? 'ativo' : ''}`} onClick={() => setActiveTab('mapa')}>🗺️ Mapa</button>
                </div>

                {activeTab === 'meteo' && (
                  <div id="ge-tab-meteo" className="ge-tab-conteudo ativo">
                    {meteoDados.carregando && <div id="ge-spinner-meteo">A carregar previsão meteorológica…</div>}
                    
                    {meteoDados.visivel && (
                      <div id="ge-meteo-resultado">
                        <div className="ge-meteo-header">
                          <div className="ge-meteo-icon">{meteoDados.icon}</div>
                          <div>
                            <div className="ge-meteo-temp">{meteoDados.temp}</div>
                            <div className="ge-meteo-desc">{meteoDados.desc}</div>
                          </div>
                        </div>
                        <div className="ge-meteo-grid">
                          <div className="ge-meteo-item"><strong>Máx / Mín</strong><span>{meteoDados.maxmin}</span></div>
                          <div className="ge-meteo-item"><strong>Precipitação</strong><span>{meteoDados.precip}</span></div>
                          <div className="ge-meteo-item"><strong>Vento</strong><span>{meteoDados.vento}</span></div>
                          <div className="ge-meteo-item"><strong>Humidade</strong><span>{meteoDados.humidade}</span></div>
                          <div className="ge-meteo-item"><strong>UV</strong><span>{meteoDados.uv}</span></div>
                          <div className="ge-meteo-item"><strong>Nascer / Pôr Sol</strong><span>{meteoDados.sol}</span></div>
                        </div>
                        {meteoDados.aviso && <div id="ge-meteo-aviso" style={{ display: 'block' }}>{meteoDados.aviso}</div>}
                      </div>
                    )}
                    
                    {meteoErro && <div id="ge-meteo-erro" style={{ display: 'block', color: '#9b2c2c', fontSize: '13px', padding: '12px 0' }}>{meteoErro}</div>}
                  </div>
                )}

                <div id="ge-tab-mapa" className={`ge-tab-conteudo ${activeTab === 'mapa' ? 'ativo' : ''}`}>
                  <div id="ge-mapa-contentor"></div>
                  <div id="ge-mapa-info" dangerouslySetInnerHTML={{ __html: mapaInfoTexto }}></div>
                </div>
              </div>
            )}
          </div>

          <h2 className="ge-lista-titulo">Eventos Registados</h2>
          <div id="ge-lista-eventos">
            {eventos.length === 0 ? (
              <p style={{ color: '#718096' }}>Nenhum evento encontrado.</p>
            ) : (
              eventos.map(ev => (
                <div key={ev.id} className="ge-card-evento">
                  <div>
                    <h3>{ev.titulo}</h3>
                    <p>📅 {ev.data.split('-').reverse().join('/')} às {ev.hora}</p>
                    <p>📍 {ev.local}</p>
                    {ev.descricao && <p style={{ marginTop: '0.4rem', color: '#718096' }}>{ev.descricao}</p>}
                  </div>
                  <div className="ge-card-acoes">
                    <button className="ge-btn ge-btn-warning" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>✏️ Editar</button>
                    <button className="ge-btn ge-btn-danger" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleEliminarEvento(ev.id)}>🗑️ Remover</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}