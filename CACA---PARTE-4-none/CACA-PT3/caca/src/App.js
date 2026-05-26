import Footer from './components/Footer/Index';
import Gestao_eventos from './components/Gestao_eventos/Index';

function App() {
  return (
    <div className="App">
      <main style={{ minHeight: '250vh', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Centro Académico Clínico dos Açores</h2>
        <p>Área de desenvolvimento e testes.</p>
      </main>

      <Gestao_eventos />
      <Footer />
    </div>
  );
}

export default App;