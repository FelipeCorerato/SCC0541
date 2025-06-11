import React, { useState, useEffect } from 'react';
import { getPilotoPontosPorAno, type PilotoPontosPorAno } from '../services/drivers';
import type { User } from '../services/auth';
import '../styles/Relatorios.css';

interface PilotoRelatoriosProps {
  user?: User | null;
}

const PilotoRelatorios: React.FC<PilotoRelatoriosProps> = ({ user }) => {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCircuit, setSelectedCircuit] = useState('all');
  const [dadosPontos, setDadosPontos] = useState<PilotoPontosPorAno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados quando o componente montar
  useEffect(() => {
    loadDadosPontos();
  }, [user]);

  const loadDadosPontos = async () => {
    if (!user || !user.idoriginal) {
      setError('Usuário não identificado ou ID do piloto não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getPilotoPontosPorAno(user.idoriginal);
      setDadosPontos(data);
    } catch (err) {
      setError('Erro ao carregar dados de pontos do piloto');
      console.error('Erro ao carregar pontos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Extrair anos únicos dos dados
  const years = [...new Set(dadosPontos.map(item => item.ano.toString()))].sort((a, b) => parseInt(b) - parseInt(a));
  
  // Extrair corridas únicas dos dados filtradas pelo ano selecionado
  const corridasDoAno = selectedYear === 'all' 
    ? dadosPontos 
    : dadosPontos.filter(item => item.ano.toString() === selectedYear);
    
  const circuits = [
    { value: 'all', label: 'Todas as Corridas' },
    ...Array.from(new Set(corridasDoAno.map(item => item.corrida)))
      .sort()
      .map(corrida => ({
        value: corrida.toLowerCase().replace(/\s+/g, '-'),
        label: corrida
      }))
  ];

  // Resetar seleção de corrida quando o ano mudar
  useEffect(() => {
    setSelectedCircuit('all');
  }, [selectedYear]);

  const filteredData = dadosPontos.filter(item => {
    const yearMatch = selectedYear === 'all' || item.ano.toString() === selectedYear;
    const circuitMatch = selectedCircuit === 'all' || 
      item.corrida.toLowerCase().replace(/\s+/g, '-') === selectedCircuit;
    return yearMatch && circuitMatch;
  });

  return (
    <div className="reports-content">
      <h1>Relatórios</h1>
      <p className="subtitle">Relatórios detalhados de performance do piloto</p>

      {/* Loading */}
      {isLoading && (
        <div className="loading-message">
          <p>Carregando dados...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadDadosPontos} className="retry-button">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Conteúdo principal - só mostra se não está carregando e não há erro */}
      {!isLoading && !error && (
        <>
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
              <label>Corrida:</label>
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
                <h3>Corridas com Pontos</h3>
                <p>{filteredData.filter(item => item.pontos > 0).length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#2196f3' }}>
                <span>🏁</span>
              </div>
              <div className="stat-content">
                <h3>Total de Corridas</h3>
                <p>{filteredData.length}</p>
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
                <span>📊</span>
              </div>
              <div className="stat-content">
                <h3>Média de Pontos</h3>
                <p>{filteredData.length > 0 ? (filteredData.reduce((sum, item) => sum + item.pontos, 0) / filteredData.length).toFixed(1) : '0'}</p>
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
                      <th>Corrida</th>
                      <th>Ano</th>
                      <th>Pontos</th>
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
                            <span>{item.corrida}</span>
                          </div>
                        </td>
                        <td>{item.ano}</td>
                        <td>
                          <span className={`points ${item.pontos > 0 ? 'points-positive' : 'points-zero'}`}>
                            {item.pontos}
                          </span>
                        </td>
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
        </>
      )}
    </div>
  );
};

export default PilotoRelatorios; 