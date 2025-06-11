import React, { useState, useEffect } from 'react';
import { getPilotoPontosPorAno, getPilotoResultadosPorStatus, type PilotoPontosPorAno, type PilotoResultadosPorStatus } from '../services/drivers';
import type { User } from '../services/auth';
import '../styles/Relatorios.css';

interface PilotoRelatoriosProps {
  user?: User | null;
}

const PilotoRelatorios: React.FC<PilotoRelatoriosProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'pontos' | 'status'>('pontos');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCircuit, setSelectedCircuit] = useState('all');
  const [dadosPontos, setDadosPontos] = useState<PilotoPontosPorAno[]>([]);
  const [dadosStatus, setDadosStatus] = useState<PilotoResultadosPorStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados quando o componente montar ou quando a aba mudar
  useEffect(() => {
    if (activeTab === 'pontos') {
      loadDadosPontos();
    } else if (activeTab === 'status') {
      loadDadosStatus();
    }
  }, [activeTab, user]);

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

  const loadDadosStatus = async () => {
    if (!user || !user.idoriginal) {
      setError('Usuário não identificado ou ID do piloto não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getPilotoResultadosPorStatus(user.idoriginal);
      setDadosStatus(data);
    } catch (err) {
      setError('Erro ao carregar dados de status do piloto');
      console.error('Erro ao carregar status:', err);
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

      {/* Abas de navegação */}
      <div className="report-tabs">
        <div 
          className={`tab ${activeTab === 'pontos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pontos')}
        >
          <div className="icon" style={{ backgroundColor: '#ff9800' }}>
            <span>⭐</span>
          </div>
          <span>Pontos por Corrida</span>
        </div>
        <div 
          className={`tab ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          <div className="icon" style={{ backgroundColor: '#5c9fff' }}>
            <span>📊</span>
          </div>
          <span>Resultados por Status</span>
        </div>
      </div>

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
          <button onClick={activeTab === 'pontos' ? loadDadosPontos : loadDadosStatus} className="retry-button">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Conteúdo da aba de pontos */}
      {!isLoading && !error && activeTab === 'pontos' && (
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

      {/* Conteúdo da aba de status */}
      {!isLoading && !error && activeTab === 'status' && (
        <>
          <div className="status-results">
            <h3>Status dos Resultados</h3>
            <p className="status-description">
              Mostra quantas vezes cada tipo de resultado final aconteceu nas corridas do piloto.
            </p>
          </div>

          {/* Estatísticas Resumidas de Status */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#4caf50' }}>
                <span>✅</span>
              </div>
              <div className="stat-content">
                <h3>Corridas Finalizadas</h3>
                <p>{dadosStatus.find(item => item.status === 'Finished')?.total || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#f44336' }}>
                <span>💥</span>
              </div>
              <div className="stat-content">
                <h3>Acidentes</h3>
                <p>{dadosStatus.filter(item => item.status.toLowerCase().includes('accident') || item.status.toLowerCase().includes('collision')).reduce((sum, item) => sum + item.total, 0)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#ff9800' }}>
                <span>⚙️</span>
              </div>
              <div className="stat-content">
                <h3>Problemas Mecânicos</h3>
                <p>{dadosStatus.filter(item => item.status.toLowerCase().includes('engine') || item.status.toLowerCase().includes('gearbox') || item.status.toLowerCase().includes('transmission')).reduce((sum, item) => sum + item.total, 0)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#9c27b0' }}>
                <span>📊</span>
              </div>
              <div className="stat-content">
                <h3>Total de Resultados</h3>
                <p>{dadosStatus.reduce((sum, item) => sum + item.total, 0)}</p>
              </div>
            </div>
          </div>

          {/* Tabela de Status Detalhada */}
          <div className="table-section">
            <h2>Status Detalhados</h2>
            
            <div className="table-container">
              {dadosStatus.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosStatus.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div className="status-info">
                              <div className="icon status-icon">
                                <span>
                                  {item.status === 'Finished' ? '🏁' :
                                   item.status.toLowerCase().includes('accident') ? '💥' :
                                   item.status.toLowerCase().includes('engine') ? '⚙️' :
                                   item.status.toLowerCase().includes('retired') ? '🚫' :
                                   item.status.toLowerCase().includes('disqualified') ? '❌' :
                                   item.status.toLowerCase().includes('spun') ? '🌪️' :
                                   '📊'}
                                </span>
                              </div>
                              <span>{item.status}</span>
                            </div>
                          </td>
                          <td>
                            <span className="status-count-badge">
                              {item.total}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <p>Nenhum resultado de status encontrado para este piloto</p>
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