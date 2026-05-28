import "./Missao.css";

function Missao() {
  return (
    <>
      <div
        className="missao"
        id="missao"
        style={{ backgroundImage: "url('/imagens/missao-objetivo/paisagem1.png')" }}
      >
        <h2>A nossa Missão</h2>
        <p>Ser uma instituição académica com o intuito de apoiar a realização
          de projetos locais, promovendo a inovação e rigor a fim de inspirar
          boa fé e confiança no setor medicinal e farmacêutico.</p>
      </div>

      <div
        className="objetivo"
        style={{ backgroundImage: "url('/imagens/missao-objetivo/paisagem2.png')" }}
      >
        <h2>Objetivo</h2>
        <p>Apoiar os seus associados e servir como ponto de referência para estes,
          com um foco em instituições clínicas e académicas locais e em alunos
          com interesse nestas áreas.</p>
      </div>
    </>
  );
}

export default Missao;