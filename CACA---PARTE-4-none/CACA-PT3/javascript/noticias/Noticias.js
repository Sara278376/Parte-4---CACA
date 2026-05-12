// noticias-saude.js
(function() {
    const RSS_URL = 'https://www.who.int/rss-feeds/news-english.xml';
    const PROXY_URL = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(RSS_URL);
    const container = document.getElementById('feed-noticias-container');

    async function carregarNoticias() {
        try {
            const resposta = await fetch(PROXY_URL);
            const dados = await resposta.json();

            if (!dados || dados.status !== 'ok' || !dados.items || dados.items.length === 0) {
                throw new Error('Não foi possível obter as notícias agora.');
            }

            const noticias = dados.items.slice(0, 6);
            let html = '<div class="noticias-grid">';

            noticias.forEach(item => {
                const titulo = item.title;
                const link = item.link;
                const descricao = item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 140) : 'Leia a notícia completa no site da OMS.';
                const dataPub = new Date(item.pubDate).toLocaleDateString('pt-PT');

                html += `
                    <div class="noticia-card">
                        <div class="conteudo">
                            <h3><a href="${link}" target="_blank" rel="noopener noreferrer">${titulo}</a></h3>
                            <div class="noticia-data">
                                <i class="fa fa-calendar-alt"></i> ${dataPub}
                            </div>
                            <div class="noticia-desc">${descricao}…</div>
                            <div class="noticia-link">
                                <a href="${link}" target="_blank" rel="noopener noreferrer">Ler mais →</a>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            container.innerHTML = html;

        } catch (erro) {
            console.error('Erro ao carregar feed RSS:', erro);
            container.innerHTML = `
                <div class="erro-noticias">
                    <i class="fa fa-exclamation-triangle"></i> 
                    Não foi possível carregar as notícias de saúde neste momento. 
                    Tente novamente mais tarde.
                </div>
            `;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', carregarNoticias);
    } else {
        carregarNoticias();
    }
})();
