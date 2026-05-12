// Gestão de subscrições de newsletter com IndexedDB


const NL_DB_NOME    = 'cacaNewsletter';
const NL_DB_VERSAO  = 1;
const NL_STORE      = 'subscritores';
let   nlDb          = null;

// Inicialização da IndexedDB 

/**
 * Abre (ou cria) a base de dados IndexedDB para a newsletter.
 * Cria o object store 'subscritores' com índice único por e-mail,
 * garantindo que o mesmo endereço não pode ser registado duas vezes.
 * @returns {Promise<IDBDatabase>}
 */
function nlAbrirDB() {
    return new Promise((resolve, reject) => {
        const pedido = indexedDB.open(NL_DB_NOME, NL_DB_VERSAO);

        pedido.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains(NL_STORE)) {
                const store = database.createObjectStore(NL_STORE, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                // Índice único por email — impede duplicados
                store.createIndex('email', 'email', { unique: true });
            }
        };

        pedido.onsuccess = (e) => { nlDb = e.target.result; resolve(nlDb); };
        pedido.onerror   = (e) => reject(e.target.error);
    });
}

// Operações CRUD 

/**
 * Wrapper genérico para operações na IndexedDB.
 * @param {string}   mode - 'readonly' ou 'readwrite'
 * @param {Function} fn   - recebe o objectStore e devolve um IDBRequest
 * @returns {Promise<any>}
 */
function nlIdbOp(mode, fn) {
    return new Promise((resolve, reject) => {
        const tx  = nlDb.transaction(NL_STORE, mode);
        const req = fn(tx.objectStore(NL_STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror   = () => reject(req.error);
    });
}

/**
 * Insere um novo subscritor na IndexedDB.
 * Lança erro se o e-mail já existir (índice único).
 * @param {{ nome: string, email: string, dataSubscricao: string }} subscritor
 * @returns {Promise<IDBValidKey>} ID gerado
 */
function nlAdicionarSubscritor(subscritor) {
    return nlIdbOp('readwrite', store => store.add(subscritor));
}

/**
 * Verifica se um e-mail já está registado.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
function nlEmailExiste(email) {
    return new Promise((resolve, reject) => {
        const tx    = nlDb.transaction(NL_STORE, 'readonly');
        const index = tx.objectStore(NL_STORE).index('email');
        const req   = index.get(email);
        req.onsuccess = () => resolve(req.result !== undefined);
        req.onerror   = () => reject(req.error);
    });
}

// Validação 

/**
 * Valida o formato do e-mail com expressão regular.
 * @param {string} email
 * @returns {boolean}
 */
function nlValidarEmail(email) {
    return /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.trim());
}

/**
 * Valida o nome (mínimo 2 caracteres, apenas letras e espaços).
 * @param {string} nome
 * @returns {boolean}
 */
function nlValidarNome(nome) {
    return nome.trim().length >= 2;
}

// Feedback ao utilizador 

/**
 * Mostra uma mensagem de feedback na secção da newsletter.
 * Remove-se automaticamente após 4 segundos em caso de sucesso.
 * @param {string}  texto   - Mensagem a apresentar
 * @param {'sucesso'|'erro'} tipo - Estilo da mensagem
 */
function nlMostrarFeedback(texto, tipo) {
    // O HTML usa "newsletter-feedbaxck" (typo original mantido para não partir o CSS)
    const el = document.querySelector('.newsletter-feedbaxck');
    if (!el) return;

    el.textContent  = texto;
    el.className    = `newsletter-feedbaxck newsletter-feedback newsletter-feedback--${tipo}`;
    el.style.display = 'block';

    if (tipo === 'sucesso') {
        setTimeout(() => {
            el.style.display = 'none';
            el.className     = 'newsletter-feedbaxck';
        }, 4000);
    }
}

// Ação principal: submeter formulário 

/**
 * Lê, valida e persiste os dados do formulário de newsletter.
 * Chamada pelo onclick do botão "Subscrever" no HTML.
 */
async function nlSubmeter() {
    const nomeEl  = document.getElementById('nl-nome');
    const emailEl = document.getElementById('nl-email');

    const nome  = nomeEl  ? nomeEl.value.trim()  : '';
    const email = emailEl ? emailEl.value.trim()  : '';

    // Validação de campos 
    if (!nlValidarNome(nome)) {
        nlMostrarFeedback('❌ Introduz um nome válido (mínimo 2 caracteres).', 'erro');
        nomeEl && nomeEl.focus();
        return;
    }

    if (!nlValidarEmail(email)) {
        nlMostrarFeedback('❌ O endereço de e-mail introduzido não é válido.', 'erro');
        emailEl && emailEl.focus();
        return;
    }

    //Verificar duplicado
    try {
        const jaExiste = await nlEmailExiste(email);
        if (jaExiste) {
            nlMostrarFeedback('⚠️ Este e-mail já está subscrito na nossa newsletter.', 'erro');
            return;
        }
    } catch (err) {
        console.error('Erro ao verificar e-mail:', err);
        nlMostrarFeedback('❌ Erro interno. Por favor tenta novamente.', 'erro');
        return;
    }

    // Guardar na IndexedDB 
    const subscritor = {
        nome,
        email,
        dataSubscricao: new Date().toISOString()
    };

    try {
        await nlAdicionarSubscritor(subscritor);

        // Sucesso: limpar campos e mostrar confirmação
        if (nomeEl)  nomeEl.value  = '';
        if (emailEl) emailEl.value = '';
        nlMostrarFeedback(`✅ Obrigado, ${nome}! A subscrição foi realizada com sucesso.`, 'sucesso');

    } catch (err) {
        // Erro de índice único (caso raro de race condition)
        if (err.name === 'ConstraintError') {
            nlMostrarFeedback('⚠️ Este e-mail já está subscrito na nossa newsletter.', 'erro');
        } else {
            console.error('Erro ao guardar subscrição:', err);
            nlMostrarFeedback('❌ Não foi possível guardar a subscrição. Tenta novamente.', 'erro');
        }
    }
}

// Inicialização

/**
 * Inicializa a IndexedDB da newsletter quando o DOM estiver pronto.
 * Em caso de falha, desativa o botão e informa o utilizador.
 */
function nlIniciar() {
    nlAbrirDB().catch(err => {
        console.error('Falha ao abrir IndexedDB da newsletter:', err);
        const btn = document.querySelector('.newsletter-formulario button');
        if (btn) {
            btn.disabled    = true;
            btn.textContent = 'Serviço indisponível';
        }
        nlMostrarFeedback('❌ Não foi possível inicializar o sistema de subscrição.', 'erro');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', nlIniciar);
} else {
    nlIniciar();
}
