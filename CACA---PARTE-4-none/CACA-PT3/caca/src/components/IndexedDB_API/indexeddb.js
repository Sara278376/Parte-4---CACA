const NL_DB_NOME    = 'cacaNewsletter';
const NL_DB_VERSAO  = 1;
const NL_STORE      = 'subscritores';
let nlDb            = null;

export function abrirNewsletterDB() { // Criação base dados e tabelas
    return new Promise((resolve, reject) => {
        if (nlDb) return resolve(nlDb);
        const pedido = indexedDB.open(NL_DB_NOME, NL_DB_VERSAO);

        pedido.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains(NL_STORE)) {
                const store = database.createObjectStore(NL_STORE, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('email', 'email', { unique: true });
            }
        };

        pedido.onsuccess = (e) => { nlDb = e.target.result; resolve(nlDb); };
        pedido.onerror   = (e) => reject(e.target.error);
    });
}

function newsletterIdbOp(mode, fn) { // Acesso a tablea para newsletter
    return abrirNewsletterDB().then(() => {
        return new Promise((resolve, reject) => {
            const tx  = nlDb.transaction(NL_STORE, mode);
            const req = fn(tx.objectStore(NL_STORE));
            req.onsuccess = () => resolve(req.result);
            req.onerror   = () => reject(req.error);
        });
    });
}

export function adicionarSubscritor(subscritor) { // Adicionar subscritor newsletter
    return newsletterIdbOp('readwrite', store => store.add(subscritor));
}

export function verificarEmailExiste(email) { // Validação email
    return abrirNewsletterDB().then(() => {
        return new Promise((resolve, reject) => {
            const tx    = nlDb.transaction(NL_STORE, 'readonly');
            const index = tx.objectStore(NL_STORE).index('email');
            const req   = index.get(email);
            req.onsuccess = () => resolve(req.result !== undefined);
            req.onerror   = () => reject(req.error);
        });
    });
}

const GE_DB_NOME    = 'cacaEventos';
const GE_DB_VERSAO  = 1;
const GE_STORE      = 'eventos';
let geDb            = null;

export function abrirDB() {
    return new Promise((resolve, reject) => {
        if (geDb) return resolve(geDb);
        const pedido = indexedDB.open(GE_DB_NOME, GE_DB_VERSAO);

        pedido.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains(GE_STORE)) {
                database.createObjectStore(GE_STORE, { keyPath: 'id', autoIncrement: true });
            }
        };

        pedido.onsuccess = (e) => { geDb = e.target.result; resolve(geDb); };
        pedido.onerror   = (e) => reject(e.target.error);
    });
}

function geIdbOp(mode, fn) {
    return abrirDB().then(() => {
        return new Promise((resolve, reject) => {
            const tx  = geDb.transaction(GE_STORE, mode);
            const req = fn(tx.objectStore(GE_STORE));
            req.onsuccess = () => resolve(req.result);
            req.onerror   = () => reject(req.error);
        });
    });
}

// Operações com bases de dados
export function geListarEventos() {
    return geIdbOp('readonly', store => store.getAll());
}
export function geAdicionarEvento(evento) {
    return geIdbOp('readwrite', store => store.add(evento));
}
export function geRemoverEvento(id) {
    return geIdbOp('readwrite', store => store.delete(id));
}
export function geAtualizarEvento(evento) {
    return geIdbOp('readwrite', store => store.put(evento));
}
export function geObterEvento(id) {
    return geIdbOp('readonly', store => store.get(id));
}

//  Geocodificação — Nominatim (OpenStreetMap)

export async function geGeocodificar(local) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(local)}&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'CACA-React-App-v4' } });
    const dados = await res.json();
    if (!dados || dados.length === 0) throw new Error('Localização não encontrada.');
    return { lat: parseFloat(dados[0].lat), lon: parseFloat(dados[0].lon), nome: dados[0].display_name };
}

export async function geObterMeteo(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,sunrise,sunset,uv_index_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao obter dados meteorológicos.');
    return await res.json();
}

export function geInterpretarWMO(codigo) {
    if (codigo === 0) return { emoji: '☀️', desc: 'Céu limpo' };
    if ([1, 2, 3].includes(codigo)) return { emoji: '⛅', desc: 'Parcialmente nublado' };
    if ([45, 48].includes(codigo)) return { emoji: '🌫️', desc: 'Nevoeiro' };
    if ([51, 53, 55, 61, 63, 65].includes(codigo)) return { emoji: '🌧️', desc: 'Chuva' };
    if ([71, 73, 75].includes(codigo)) return { emoji: '❄️', desc: 'Neve' };
    if ([80, 81, 82, 95, 96, 99].includes(codigo)) return { emoji: '⛈️', desc: 'Aguaceiros / Trovoada' };
    return { emoji: '🌡️', desc: 'Variável' };
}

let mapaInstance = null;
export function geMostrarMapa(contentorId, lat, lon, nomeLocal, tituloEvento, data, hora) {
    setTimeout(() => {
        if (!window.L) return;
        const container = document.getElementById(contentorId);
        if (!container) return;

        if (mapaInstance) {
            mapaInstance.remove();
            mapaInstance = null;
        }
        
        container.innerHTML = "";
        const targetDiv = document.createElement('div');
        targetDiv.style.width = '100%';
        targetDiv.style.height = '100%';
        container.appendChild(targetDiv);

        mapaInstance = window.L.map(targetDiv).setView([lat, lon], 14);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapaInstance);

        const popupConteudo = `<strong>${tituloEvento || 'Evento'}</strong><br>📍 ${nomeLocal.split(',')[0]}<br>📅 ${data} às ${hora}`;
        window.L.marker([lat, lon]).addTo(mapaInstance).bindPopup(popupConteudo).openPopup();
    }, 100);
}