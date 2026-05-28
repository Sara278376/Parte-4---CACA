const NL_DB_NOME    = 'cacaNewsletter';
const NL_DB_VERSAO  = 1;
const NL_STORE      = 'subscritores';
let nlDb            = null;

export function nlAbrirDB() {
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

function nlIdbOp(mode, fn) {
    return nlAbrirDB().then(() => {
        return new Promise((resolve, reject) => {
            const tx  = nlDb.transaction(NL_STORE, mode);
            const req = fn(tx.objectStore(NL_STORE));
            req.onsuccess = () => resolve(req.result);
            req.onerror   = () => reject(req.error);
        });
    });
}

export function nlAdicionarSubscritor(subscritor) {
    return nlIdbOp('readwrite', store => store.add(subscritor));
}

export function nlEmailExiste(email) {
    return nlAbrirDB().then(() => {
        return new Promise((resolve, reject) => {
            const tx    = nlDb.transaction(NL_STORE, 'readonly');
            const index = tx.objectStore(NL_STORE).index('email');
            const req   = index.get(email);
            req.onsuccess = () => resolve(req.result !== undefined);
            req.onerror   = () => reject(req.error);
        });
    });
}