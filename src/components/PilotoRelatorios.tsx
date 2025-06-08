import React, { useState } from 'react';
import '../styles/Relatorios.css';

const PilotoRelatorios: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2022');
  const [selectedCircuit, setSelectedCircuit] = useState('all');

  const years = ['2021', '2022'];
  const circuits = [
    { value: 'all', label: 'Todos os Circuitos' },
    { value: 'tronca-verde', label: 'Tronca Verde' },
    { value: 'xablau', label: 'Xablau' }
  ];

  const reportData = [
    {
      circuito: 'Tronca Verde',
      ano: '2021',
      posicao: 1,
      pontos: 25,
      tempo: '1:23:45.123',
      voltaRapida: '1:18.456'
    },
    {
      circuito: 'Tronca Verde',
      ano: '2022',
      posicao: 2,
      pontos: 18,
      tempo: '1:24:12.789',
      voltaRapida: '1:17.892'
    },
    {
      circuito: 'Xablau',
      ano: '2021',
      posicao: 15,
      pontos: 0,
      tempo: '1:45:23.456',
      voltaRapida: '1:35.123'
    }
  ];

  const filteredData = reportData.filter(item => {
    const yearMatch = selectedYear === 'all' || item.ano === selectedYear;
    const circuitMatch = selectedCircuit === 'all' || 
      item.circuito.toLowerCase().replace(' ', '-') === selectedCircuit;
    return yearMatch && circuitMatch;
  });

  return (
    <div className="reports-content">
      <h1>Relatórios</h1>
      <p className="subtitle">Relatórios detalhados de performance do piloto</p>

      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Ano:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">Todos os Anos</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Circuito:</label>
          <select 
            value={selectedCircuit} 
            onChange={(e) => setSelectedCircuit(e.target.value)}
          >
            {circuits.map(circuit => (
              <option key={circuit.value} value={circuit.value}>
                {circuit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estatísticas Resumidas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#4caf50' }}>
            <span>🏆</span>
          </div>
          <div className="stat-content">
            <h3>Vitórias</h3>
            <p>{filteredData.filter(item => item.posicao === 1).length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#2196f3' }}>
            <span>🏁</span>
          </div>
          <div className="stat-content">
            <h3>Pódios</h3>
            <p>{filteredData.filter(item => item.posicao <= 3).length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ff9800' }}>
            <span>⭐</span>
          </div>
          <div className="stat-content">
            <h3>Total de Pontos</h3>
            <p>{filteredData.reduce((sum, item) => sum + item.pontos, 0)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#9c27b0' }}>
            <span>🏎️</span>
          </div>
          <div className="stat-content">
            <h3>Corridas</h3>
            <p>{filteredData.length}</p>
          </div>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="table-section">
        <h2>Resultados Detalhados</h2>
        
        <div className="table-container">
          {filteredData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Circuito</th>
                  <th>Ano</th>
                  <th>Posição</th>
                  <th>Pontos</th>
                  <th>Tempo Total</th>
                  <th>Volta Mais Rápida</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="circuit-info">
                        <div className="icon circuit-icon">
                          <span>🏁</span>
                        </div>
                        <span>{item.circuito}</span>
                      </div>
                    </td>
                    <td>{item.ano}</td>
                    <td>
                      <span className={`position position-${item.posicao <= 3 ? 'podium' : 'regular'}`}>
                        {item.posicao}º
                      </span>
                    </td>
                    <td>{item.pontos}</td>
                    <td>{item.tempo}</td>
                    <td>{item.voltaRapida}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>Nenhum resultado encontrado para os filtros selecionados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PilotoRelatorios; 