import Footer from './components/Footer/Index';
import Gestao_eventos from './components/Gestao_eventos/Index';
import GSAP from './components/GSAP/Index';

function App() {
  return (
    <div className="App">
      <GSAP> {/* Aplicacao de animação sobre o resto dos segmentos */}
        <main className="missao" style={{ minHeight: '250vh', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Centro Académico Clínico dos Açores</h2>
        </main>

        <Gestao_eventos />
        <Footer />
      </GSAP>
    </div>
  );
}

export default App;