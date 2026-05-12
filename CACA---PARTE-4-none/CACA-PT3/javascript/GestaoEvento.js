function iniciarGestaoEventos() {
    abrirDB()
        .then(() => {
            document.getElementById('ge-data').min = new Date().toISOString().split('T')[0];
            geRenderizarEventos();
        })
        .catch(err => {
            document.getElementById('ge-lista-eventos').innerHTML =
                '<p style="color:red;">Erro ao inicializar a base de dados. Abre a consola do browser.</p>';
            console.error('Falha ao abrir IndexedDB:', err);
        });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarGestaoEventos);
} else {
    iniciarGestaoEventos();
}

//  IndexedDB — Eventos

const DB_NOME       = 'cacaEventosDB';
const DB_VERSAO     = 1;
const STORE_EVENTOS = 'eventos';
let db;

function abrirDB() {
    return new Promise((resolve, reject) => {
        const pedido = indexedDB.open(DB_NOME, DB_VERSAO);
        pedido.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains(STORE_EVENTOS)) {
                const store = database.createObjectStore(STORE_EVENTOS, { keyPath: 'id', autoIncrement: true });
                store.createIndex('data', 'data', { unique: false });
            }
        };
        pedido.onsuccess = (e) => { db = e.target.result; resolve(db); };
        pedido.onerror   = (e) => reject(e.target.error);
    });
}

function geAdicionarEvento(ev) { return geIdbOp('readwrite', s => s.add(ev)); }
function geAtualizarEvento(ev) { return geIdbOp('readwrite', s => s.put(ev)); }
function geRemoverEvento(id)   { return geIdbOp('readwrite', s => s.delete(id)); }
function geListarEventos()     { return geIdbOp('readonly',  s => s.getAll()); }
function geObterEvento(id)     { return geIdbOp('readonly',  s => s.get(id)); }

function geIdbOp(mode, fn) {
    return new Promise((resolve, reject) => {
        const tx  = db.transaction(STORE_EVENTOS, mode);
        const req = fn(tx.objectStore(STORE_EVENTOS));
        req.onsuccess = () => resolve(req.result);
        req.onerror   = () => reject(req.error);
    });
}

//  Geocodificação — Nominatim (OpenStreetMap)

async function geGeocodificar(localStr) {
    const url  = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(localStr)}&format=json&limit=1`;
    const resp = await fetch(url, { headers: { 'Accept-Language': 'pt' } });
    if (!resp.ok) throw new Error('Falha na geocodificação');
    const data = await resp.json();
    if (!data.length) throw new Error('Local não encontrado. Tenta uma cidade ou endereço mais específico.');
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), nome: data[0].display_name };
}


//  Meteorologia — Open-Meteo


/** Mapeia o weather code do Open-Meteo para emoji + descrição */
function geInterpretarWMO(code) {
    const t = {
        0:'Céu limpo', 1:'Maioritariamente limpo', 2:'Parcialmente nublado', 3:'Nublado',
        45:'Nevoeiro', 48:'Nevoeiro com geada',
        51:'Chuvisco leve', 53:'Chuvisco moderado', 55:'Chuvisco denso',
        61:'Chuva leve', 63:'Chuva moderada', 65:'Chuva forte',
        71:'Neve leve', 73:'Neve moderada', 75:'Neve forte',
        77:'Granizo', 80:'Aguaceiros leves', 81:'Aguaceiros', 82:'Aguaceiros fortes',
        85:'Aguaceiros de neve', 86:'Aguaceiros de neve fortes',
        95:'Trovoada', 96:'Trovoada c/ granizo leve', 99:'Trovoada c/ granizo forte'
    };
    const e = {
        0:'☀️', 1:'🌤️', 2:'⛅', 3:'☁️',
        45:'🌫️', 48:'🌫️',
        51:'🌦️', 53:'🌦️', 55:'🌧️',
        61:'🌧️', 63:'🌧️', 65:'🌧️',
        71:'🌨️', 73:'❄️', 75:'❄️', 77:'🌨️',
        80:'🌦️', 81:'🌧️', 82:'⛈️',
        85:'🌨️', 86:'❄️',
        95:'⛈️', 96:'⛈️', 99:'⛈️'
    };
    return { desc: t[code] || 'Desconhecido', emoji: e[code] || '🌡️' };
}

async function geObterMeteo(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
        + `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,`
        + `weathercode,uv_index_max,sunrise,sunset,relative_humidity_2m_max`
        + `&timezone=auto&forecast_days=16`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Erro na API meteorológica');
    return resp.json();
}

function geFormatarHora(isoStr) {
    if (!isoStr) return '--';
    return isoStr.substring(11, 16);
}

async function geMostrarMeteo(lat, lon, dataEvento, nomeLocal) {
    const spinEl   = document.getElementById('ge-spinner-meteo');
    const resultEl = document.getElementById('ge-meteo-resultado');
    const erroEl   = document.getElementById('ge-meteo-erro');
    const avisoEl  = document.getElementById('ge-meteo-aviso');

    resultEl.style.display = 'none';
    erroEl.style.display   = 'none';
    avisoEl.style.display  = 'none';
    spinEl.style.display   = 'block';

    try {
        const data = await geObterMeteo(lat, lon);
        const dias = data.daily.time; // array de 'YYYY-MM-DD'
        const idx  = dias.indexOf(dataEvento);

        spinEl.style.display = 'none';

        if (idx === -1) {
            erroEl.textContent = `⚠️ A data do evento (${geFormatarData(dataEvento)}) está além do horizonte de previsão de 16 dias. Consulta novamente mais perto do evento.`;
            erroEl.style.display = 'block';
            return;
        }

        const d   = data.daily;
        const wmo = geInterpretarWMO(d.weathercode[idx]);

        document.getElementById('ge-meteo-icon').textContent     = wmo.emoji;
        document.getElementById('ge-meteo-temp').textContent     = `${Math.round((d.temperature_2m_max[idx] + d.temperature_2m_min[idx]) / 2)}°C`;
        document.getElementById('ge-meteo-desc').textContent     = `${wmo.desc} · ${nomeLocal.split(',')[0]}`;
        document.getElementById('ge-meteo-maxmin').textContent   = `${d.temperature_2m_max[idx]}°C / ${d.temperature_2m_min[idx]}°C`;
        document.getElementById('ge-meteo-precip').textContent   = `${d.precipitation_sum[idx]} mm`;
        document.getElementById('ge-meteo-vento').textContent    = `${d.windspeed_10m_max[idx]} km/h`;
        document.getElementById('ge-meteo-humidade').textContent = d.relative_humidity_2m_max ? `${d.relative_humidity_2m_max[idx]}%` : 'N/D';
        document.getElementById('ge-meteo-uv').textContent       = d.uv_index_max[idx] ?? 'N/D';
        document.getElementById('ge-meteo-sol').textContent      = `${geFormatarHora(d.sunrise[idx])} / ${geFormatarHora(d.sunset[idx])}`;

        resultEl.style.display = 'block';

        if (d.precipitation_sum[idx] >= 5) {
            avisoEl.textContent = `⛈️ Atenção: espera-se precipitação de ${d.precipitation_sum[idx]} mm neste dia. Considera um plano de contingência.`;
            avisoEl.style.display = 'block';
        }
    } catch (err) {
        spinEl.style.display = 'none';
        erroEl.textContent   = '❌ ' + err.message;
        erroEl.style.display = 'block';
    }
}


//  Mapa — Leaflet + OpenStreetMap 

let geMapaInstance = null;
let geMarcador     = null;

function geMostrarMapa(lat, lon, nomeLocal, titulo, data, hora) {
    if (!geMapaInstance) {
        geMapaInstance = L.map('ge-mapa-contentor').setView([lat, lon], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(geMapaInstance);
    } else {
        geMapaInstance.setView([lat, lon], 14);
        if (geMarcador) geMapaInstance.removeLayer(geMarcador);
    }

    const icone = L.divIcon({
        className: '',
        html: `<div style="
            width:36px; height:36px; border-radius:50% 50% 50% 0;
            transform:rotate(-45deg); background:#1B3577;
            border:3px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,.3);
        "></div>`,
        iconSize:   [36, 36],
        iconAnchor: [18, 36],
        popupAnchor:[0, -40]
    });

    geMarcador = L.marker([lat, lon], { icon: icone }).addTo(geMapaInstance);
    geMarcador.bindPopup(
        `<strong style="color:#2d9d90;">${titulo || 'Evento'}</strong><br>
         📅 ${geFormatarData(data)} às ${hora || '--'}<br>
         📍 ${nomeLocal.split(',').slice(0, 2).join(',')}`,
        { maxWidth: 220 }
    ).openPopup();

    setTimeout(() => geMapaInstance.invalidateSize(), 100);

    document.getElementById('ge-mapa-info').innerHTML =
        `<strong>Localização encontrada:</strong> ${nomeLocal.split(',').slice(0, 3).join(',')}
         &nbsp;·&nbsp; <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}" target="_blank" rel="noopener">Abrir no OpenStreetMap ↗</a>`;
}


//  Acção: pesquisar local (lê campos do formulário, chama APIs)

let geUltimaGeo = null; // cache para não repetir geocodificação desnecessária

async function gePesquisarLocal() {
    const localStr   = document.getElementById('ge-local').value.trim();
    const dataEvento = document.getElementById('ge-data').value;
    const hora       = document.getElementById('ge-hora').value;
    const titulo     = document.getElementById('ge-titulo').value.trim();

    if (!localStr) {
        geMostrarMensagem('ge-mensagem', 'Introduz um local antes de pesquisar.', 'ge-erro');
        return;
    }
    if (!dataEvento) {
        geMostrarMensagem('ge-mensagem', 'Seleciona uma data para ver a previsão meteorológica.', 'ge-erro');
        return;
    }

    const painelEl = document.getElementById('ge-painel-api');
    painelEl.style.display = 'block';
    geMostrarMensagem('ge-mensagem', 'A pesquisar localização…', 'ge-sucesso');

    try {
        if (!geUltimaGeo || geUltimaGeo.query !== localStr) {
            geUltimaGeo = { query: localStr, ...(await geGeocodificar(localStr)) };
        }
        const { lat, lon, nome } = geUltimaGeo;

        document.getElementById('ge-mensagem').style.display = 'none';

        await Promise.all([
            geMostrarMeteo(lat, lon, dataEvento, nome),
            Promise.resolve(geMostrarMapa(lat, lon, nome, titulo, dataEvento, hora))
        ]);
    } catch (err) {
        geMostrarMensagem('ge-mensagem', '❌ ' + err.message, 'ge-erro');
    }
}


//  Tabs do painel API

function geMudarTab(nome, btn) {
    document.querySelectorAll('.ge-tab-btn').forEach(b => b.classList.remove('ativo'));
    document.querySelectorAll('.ge-tab-conteudo').forEach(t => t.classList.remove('ativo'));
    btn.classList.add('ativo');
    document.getElementById('ge-tab-' + nome).classList.add('ativo');

    if (nome === 'mapa' && geMapaInstance) {
        setTimeout(() => geMapaInstance.invalidateSize(), 100);
    }
}

//  Formulário de adição

async function geGuardarEvento() {
    const titulo    = document.getElementById('ge-titulo').value.trim();
    const descricao = document.getElementById('ge-descricao').value.trim();
    const data      = document.getElementById('ge-data').value;
    const hora      = document.getElementById('ge-hora').value;
    const local     = document.getElementById('ge-local').value.trim();

    if (!titulo || !descricao || !data || !hora || !local) {
        geMostrarMensagem('ge-mensagem', 'Preenche todos os campos obrigatórios.', 'ge-erro');
        return;
    }
    const hoje = new Date().toISOString().split('T')[0];
    if (data < hoje) {
        geMostrarMensagem('ge-mensagem', 'A data do evento deve ser hoje ou uma data futura.', 'ge-erro');
        return;
    }

    await geAdicionarEvento({ titulo, descricao, data, hora, local });
    geMostrarMensagem('ge-mensagem', '✅ Evento adicionado com sucesso!', 'ge-sucesso');
    ['ge-titulo', 'ge-descricao', 'ge-data', 'ge-hora', 'ge-local'].forEach(id => {
        document.getElementById(id).value = '';
    });
    geUltimaGeo = null;
    geRenderizarEventos();
}

// Edição

async function geEditarEvento(id) {
    const evento = await geObterEvento(id);
    if (!evento) return;

    document.getElementById('ge-modal-evento-id').value  = evento.id;
    document.getElementById('ge-modal-titulo').value     = evento.titulo;
    document.getElementById('ge-modal-descricao').value  = evento.descricao;
    document.getElementById('ge-modal-data').value       = evento.data;
    document.getElementById('ge-modal-hora').value       = evento.hora;
    document.getElementById('ge-modal-local').value      = evento.local;

    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('ge-modal-data').min = hoje;

    document.getElementById('ge-modal-mensagem').style.display = 'none';
    document.getElementById('ge-modal-overlay').classList.add('aberto');
    document.getElementById('ge-modal-titulo').focus();
}

function geFecharModal() {
    document.getElementById('ge-modal-overlay').classList.remove('aberto');
}

function geFecharModalFora(e) {
    if (e.target === document.getElementById('ge-modal-overlay')) geFecharModal();
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') geFecharModal();
});

async function geGuardarEdicao() {
    const id        = parseInt(document.getElementById('ge-modal-evento-id').value);
    const titulo    = document.getElementById('ge-modal-titulo').value.trim();
    const descricao = document.getElementById('ge-modal-descricao').value.trim();
    const data      = document.getElementById('ge-modal-data').value;
    const hora      = document.getElementById('ge-modal-hora').value;
    const local     = document.getElementById('ge-modal-local').value.trim();

    if (!titulo || !descricao || !data || !hora || !local) {
        geMostrarMensagem('ge-modal-mensagem', 'Preenche todos os campos obrigatórios.', 'ge-erro');
        return;
    }
    const hoje = new Date().toISOString().split('T')[0];
    if (data < hoje) {
        geMostrarMensagem('ge-modal-mensagem', 'A data deve ser hoje ou futura.', 'ge-erro');
        return;
    }
    await geAtualizarEvento({ id, titulo, descricao, data, hora, local });
    geFecharModal();
    geMostrarMensagem('ge-mensagem', '✅ Evento atualizado com sucesso!', 'ge-sucesso');
    geRenderizarEventos();
}


//  Lista de eventos

async function geRenderizarEventos() {
    const lista   = document.getElementById('ge-lista-eventos');
    const eventos = await geListarEventos();

    if (!eventos.length) {
        lista.innerHTML = '<p style="color:#718096;">Nenhum evento encontrado.</p>';
        return;
    }
    eventos.sort((a, b) => a.data.localeCompare(b.data));
    lista.innerHTML = eventos.map(ev => `
        <div class="ge-card-evento">
            <div>
                <h3>${ev.titulo}</h3>
                <p>📅 ${geFormatarData(ev.data)} às ${ev.hora}</p>
                <p>📍 ${ev.local}</p>
                ${ev.descricao ? `<p style="margin-top:6px; color:#4a5568;">${ev.descricao}</p>` : ''}
            </div>
            <div class="ge-card-acoes">
                <button class="ge-btn ge-btn-warning" onclick="geEditarEvento(${ev.id})">✏️ Editar</button>
                <button class="ge-btn ge-btn-danger"  onclick="geEliminarEvento(${ev.id})">🗑️ Remover</button>
            </div>
        </div>
    `).join('');
}

async function geEliminarEvento(id) {
    if (!confirm('Tens a certeza que queres remover este evento?')) return;
    await geRemoverEvento(id);
    geMostrarMensagem('ge-mensagem', 'Evento removido.', 'ge-sucesso');
    geRenderizarEventos();
}


//  Utilitários

function geFormatarData(dataStr) {
    if (!dataStr) return '--';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
}

function geMostrarMensagem(elId, texto, tipoClasse) {
    const el = document.getElementById(elId);
    el.textContent   = texto;
    el.className     = 'ge-msg-feedback ' + tipoClasse;
    el.style.display = 'block';
    if (tipoClasse === 'ge-sucesso') setTimeout(() => { el.style.display = 'none'; }, 3000);
}
