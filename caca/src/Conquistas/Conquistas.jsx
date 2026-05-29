// ============================================================
// components/Conquistas/Conquistas.jsx
// Secção de Conquistas com gráficos de barra interativos.
// Migrado do HTML/CSS original para React.
// Permite alternar entre 3 datasets: Investigadores, Parceiros, Projetos.
// ============================================================

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './Conquistas.css';

// Dados migrados dos ficheiros JSON originais (datainvestigacao.json, dataparceiros.json, dataprojetos.json)
const dados = {
  investigadores: [
    { month: 'Janeiro', income: 3 },  { month: 'Fevereiro', income: 5 },
    { month: 'Março', income: 4 },    { month: 'Abril', income: 6 },
    { month: 'Maio', income: 7 },     { month: 'Junho', income: 5 },
    { month: 'Julho', income: 3 },    { month: 'Agosto', income: 2 },
    { month: 'Setembro', income: 8 }, { month: 'Outubro', income: 9 },
    { month: 'Novembro', income: 11 },{ month: 'Dezembro', income: 6 }
  ],
  parceiros: [
    { month: 'Janeiro', income: 7 },  { month: 'Fevereiro', income: 9 },
    { month: 'Março', income: 10 },   { month: 'Abril', income: 12 },
    { month: 'Maio', income: 13 },    { month: 'Junho', income: 11 },
    { month: 'Julho', income: 5 },    { month: 'Agosto', income: 4 },
    { month: 'Setembro', income: 15 },{ month: 'Outubro', income: 17 },
    { month: 'Novembro', income: 18 },{ month: 'Dezembro', income: 12 }
  ],
  projetos: [
    { month: 'Janeiro', income: 5 },  { month: 'Fevereiro', income: 7 },
    { month: 'Março', income: 6 },    { month: 'Abril', income: 9 },
    { month: 'Maio', income: 10 },    { month: 'Junho', income: 8 },
    { month: 'Julho', income: 4 },    { month: 'Agosto', income: 3 },
    { month: 'Setembro', income: 11 },{ month: 'Outubro', income: 13 },
    { month: 'Novembro', income: 14 },{ month: 'Dezembro', income: 9 }
  ]
};

// Labels dos botões — equivalente aos botões onclick="loadData(...)" do HTML original
const botoes = [
  { key: 'investigadores', label: 'Investigadores' },
  { key: 'parceiros',      label: 'Parceiros'      },
  { key: 'projetos',       label: 'Projetos'       }
];

export default function Conquistas() {
  const [ativo, setAtivo] = useState('investigadores');

  return (
    <>
      <div id="conquistas" className="scroll-anchor"></div>
      <div id="Conquistas"><h1>Conquistas</h1></div>

      <div className="conquistas">
        <p>Em 2026 houve um aumento geral de 30%</p>

        <div className="conquistas-container">
          {/* Botões para alternar entre gráficos */}
          <div className="chart_types">
            {botoes.map(b => (
              <button
                key={b.key}
                className={ativo === b.key ? 'ativo' : ''}
                onClick={() => setAtivo(b.key)}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Gráfico de barras */}
          <div className="conquistas-grafico-wrap">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dados[ativo]} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  wrapperStyle={{ fontSize: '12px', padding: '4px 8px' }}
                  contentStyle={{ background: '#1B3577', border: 'none', borderRadius: '6px', color: '#fff', padding: '4px 10px' }}
                  cursor={{ fill: 'rgba(27,53,119,0.1)' }}
                />
                <Bar dataKey="income" fill="#1B3577" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}