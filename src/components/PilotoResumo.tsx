import React, { useState } from 'react';
import '../styles/Resumo.css';

const PilotoResumo: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    '2021': true,
    '2022': true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dados mockados baseados na imagem
  const resultados2021 = [
    {
      circuito: 'Tronca Verde',
      pontos: 420,
      vitorias: 15,
      corridas: 2,
      icon: '🏎️'
    },
    {
      circuito: 'Xablau',
      pontos: 1,
      vitorias: 0,
      corridas: 50,
      icon: '🏎️'
    }
  ];

  const resultados2022 = [
    {
      circuito: 'Tronca Verde',
      pontos: 420,
      vitorias: 15,
      corridas: 2,
      icon: '🏎️'
    }
  ];

  return (
    <div className="summary-content">
      <h1>Resumo</h1>
      <p className="subtitle">Resultados do piloto para cada ano e circuito</p>

      {/* Chart */}
      <div className="chart-container">
        <div className="chart-placeholder">
          {Array.from({ length: 24 }).map((_, index) => (
            <div 
              key={index} 
              className="chart-bar" 
              style={{ 
                height: `${Math.random() * 80 + 20}px`,
                backgroundColor: index === 18 ? '#4285f4' : '#e0e8ff'
              }}
            />
          ))}
        </div>
      </div>

      {/* Circuitos em 2021 */}
      <div className="accordion-section">
        <div 
          className="accordion-header" 
          onClick={() => toggleSection('2021')}
          style={{ cursor: 'pointer' }}
        >
          <h2>Circuitos em 2021</h2>
          <span>{expandedSections['2021'] ? '▼' : '▶'}</span>
        </div>
        
        {expandedSections['2021'] && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Circuito</th>
                  <th>Pontos</th>
                  <th>Vitórias</th>
                  <th>Corridas</th>
                </tr>
              </thead>
              <tbody>
                {resultados2021.map((resultado, index) => (
                  <tr key={index}>
                    <td>
                      <div className="race-info">
                        <div className="icon race-icon">
                          <span>{resultado.icon}</span>
                        </div>
                        <span>{resultado.circuito}</span>
                      </div>
                    </td>
                    <td>{resultado.pontos}</td>
                    <td>{resultado.vitorias}</td>
                    <td>{resultado.corridas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Circuitos em 2022 */}
      <div className="accordion-section">
        <div 
          className="accordion-header" 
          onClick={() => toggleSection('2022')}
          style={{ cursor: 'pointer' }}
        >
          <h2>Circuitos em 2022</h2>
          <span>{expandedSections['2022'] ? '▼' : '▶'}</span>
        </div>
        
        {expandedSections['2022'] && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Circuito</th>
                  <th>Pontos</th>
                  <th>Vitórias</th>
                  <th>Corridas</th>
                </tr>
              </thead>
              <tbody>
                {resultados2022.map((resultado, index) => (
                  <tr key={index}>
                    <td>
                      <div className="race-info">
                        <div className="icon race-icon">
                          <span>{resultado.icon}</span>
                        </div>
                        <span>{resultado.circuito}</span>
                      </div>
                    </td>
                    <td>{resultado.pontos}</td>
                    <td>{resultado.vitorias}</td>
                    <td>{resultado.corridas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PilotoResumo; 