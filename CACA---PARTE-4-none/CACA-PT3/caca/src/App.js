import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div id="Investigacao"></div>
    <h1>Formação e Ensino</h1>

    <div class="investigacao-main">
        <button class="prev" onclick="moveSlide(-1)">&#10094;</button>
        <div class="investigacao-viewport">
            <div class="investigacao-track" id="track">
                <div class="investigacao-contentor">
                    <img src="imagens/investigacao/AI.png" alt="Investigacao AI"></img>
                    <p>14 novembro 2025 - 12 dezembro 2025</p>
                    <h2>Inteligência Artificial em Saúde</h2>
                    <p class="saberTexto">Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.</p>
                    <button name="investigacaoBotao">Saber Mais</button>
                </div>
                <div class="investigacao-contentor">
                    <img src="imagens/investigacao/cirugia.png" alt="Cirurgia" ></img>
                    <p>14 novembro 2025 - 12 dezembro 2025</p>
                    <h2>Currículo de Trauma de Coluna</h2>
                    <p class="saberTexto">Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.</p>
                    <button name="investigacaoBotao">Saber Mais</button>
                </div>
                <div class="investigacao-contentor">
                    <img src="imagens/investigacao/saudeMental.png" alt="Saude Mental em Estudantes Universitarios"></img>
                    <p>14 novembro 2025 - 12 dezembro 2025</p>
                    <h2>Saúde Mental em Estudantes Universitários</h2>
                    <p class="saberTexto">Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.</p>
                    <button name="investigacaoBotao">Saber Mais</button>
                </div>
                <div class="investigacao-contentor">
                    <img src="imagens/investigacao/primeirosSocorros.png" alt="Primeiros Socorros"></img>
                    <p>14 novembro 2025 - 12 dezembro 2025</p>
                    <h2>Primeiros Socorros em Contexto Escolar</h2>
                    <p class="saberTexto">Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.</p>
                    <button name="investigacaoBotao">Saber Mais</button>
                </div>
                <div class="investigacao-contentor">
                    <img src="imagens/investigacao/reabilitacaoFisica.png" alt="Reabilitacao Fisica"></img>
                    <p>14 novembro 2025 - 12 dezembro 2025</p>
                    <h2>Reabilitação Física Pós-Cirúrgica</h2>
                    <p class="saberTexto">Isto é uma descrição de exemplo, sendo esta uma notícia relacionada com um estudo feito pela UAC, nomeadamente a Faculdade de Ciências e Tecnologia.</p>
                    <button name="investigacaoBotao">Saber Mais</button>
                </div>
            </div>
        </div>
        <button class="next" onclick="moveSlide(1)">&#10095;</button>
    </div>
    </div>
  );
}

export default App;
