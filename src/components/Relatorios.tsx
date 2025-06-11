import React, { useState, useEffect } from 'react';
import '../styles/Relatorios.css';
import { 
  getAdminResultadosPorStatus, 
  getAdminTotalCorridas, 
  getAdminCorridasPorCircuito,
  getAdminCorridasDetalhadas,
  getAeroportosProximos,
  type AdminResultadosPorStatus,
  type AdminTotalCorridas,
  type AdminCorridasPorCircuito,
  type AdminCorridasDetalhadas,
  type AeroportoProximo
} from '../services/reports';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'airports' | 'races'>('status');
  const [activeView, setActiveView] = useState<'status' | 'airports' | 'races'>('status');
  const [expandedCircuits, setExpandedCircuits] = useState<{[key: string]: boolean}>({});

  // Estados para dados reais
  const [statusData, setStatusData] = useState<AdminResultadosPorStatus[]>([]);
  const [totalCorridas, setTotalCorridas] = useState<AdminTotalCorridas>({ total_corridas: 0 });
  const [corridasPorCircuito, setCorridasPorCircuito] = useState<AdminCorridasPorCircuito[]>([]);
  const [corridasDetalhadas, setCorridasDetalhadas] = useState<{[circuitId: number]: AdminCorridasDetalhadas[]}>({});
  const [aeroportos, setAeroportos] = useState<AeroportoProximo[]>([]);
  const [cidadeBusca, setCidadeBusca] = useState<string>('São Paulo');
  const [ultimaCidadeBuscada, setUltimaCidadeBuscada] = useState<string>('');

  // Estados de loading e erro
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle between views when a tab is clicked
  const handleTabClick = (tab: 'status' | 'airports' | 'races') => {
    setActiveTab(tab);
    setActiveView(tab);
  };

  // Toggle circuit expansion
  const toggleCircuit = async (circuitId: number, circuitName: string) => {
    const key = `${circuitId}`;
    setExpandedCircuits(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // Se está expandindo e não temos os dados detalhados ainda, buscar
    if (!expandedCircuits[key] && !corridasDetalhadas[circuitId]) {
      try {
        const detalhes = await getAdminCorridasDetalhadas(circuitId);
        setCorridasDetalhadas(prev => ({
          ...prev,
          [circuitId]: detalhes
        }));
      } catch (err) {
        console.error('Erro ao buscar detalhes do circuito:', err);
      }
    }
  };

  // Carregar dados quando a view muda
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Carregar total de corridas sempre
        const totalData = await getAdminTotalCorridas();
        setTotalCorridas(totalData);

        // Carregar dados específicos da view ativa
        if (activeView === 'status') {
          const statusResult = await getAdminResultadosPorStatus();
          setStatusData(statusResult);
        } else if (activeView === 'races') {
          const corridasResult = await getAdminCorridasPorCircuito();
          setCorridasPorCircuito(corridasResult);
        } else if (activeView === 'airports') {
          // Limpar dados de aeroportos ao entrar na view
          setAeroportos([]);
        }
      } catch (err) {
        setError('Erro ao carregar dados do relatório');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeView]);

  // Função para buscar aeroportos
  const handleBuscarAeroportos = async () => {
    if (!cidadeBusca.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const aeroportosResult = await getAeroportosProximos(cidadeBusca);
      setAeroportos(aeroportosResult);
      setUltimaCidadeBuscada(cidadeBusca); // Salvar a cidade que foi buscada
    } catch (err) {
      setError('Erro ao buscar aeroportos próximos');
      console.error('Erro ao buscar aeroportos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reports-content">
      <div className="reports-header">
        <h1>Relatórios</h1>
        <div className="total-summary">
          <div className="total-item">
            <div className="total-icon races-total-icon">
              <span>🏎️</span>
            </div>
            <div className="total-info">
              <span className="total-label">Corridas</span>
              <span className="total-value">{totalCorridas.total_corridas}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="visualize-section">
        <h2>Visualizar</h2>
        
        <div className="report-tabs">
          <div 
            className={`tab ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => handleTabClick('status')}
          >
            <div className="icon status-icon">
              <span>📊</span>
            </div>
            <span>Status</span>
          </div>
          
          <div 
            className={`tab ${activeTab === 'airports' ? 'active' : ''}`}
            onClick={() => handleTabClick('airports')}
          >
            <div className="icon airport-icon">
              <span>✈️</span>
            </div>
            <span>Aeroportos</span>
          </div>
          
          <div 
            className={`tab ${activeTab === 'races' ? 'active' : ''}`}
            onClick={() => handleTabClick('races')}
          >
            <div className="icon race-icon">
              <span>🏎️</span>
            </div>
            <span>Corridas</span>
          </div>
        </div>

        {/* Loading e Error States */}
        {isLoading && (
          <div className="loading-message">
            <p>Carregando dados...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {!isLoading && !error && activeView === 'status' && (
          <div className="status-results">
            <h3>Resultados por status</h3>
            <p className="status-description">
              A quantidade de resultados por status significa contar quantas
              vezes cada tipo de resultado final aconteceu em corridas
            </p>
            
            <div className="status-list">
              {statusData.length > 0 ? (
                statusData.map((item, index) => (
                  <div key={index} className="status-item">
                    <div className="status-icon-container">
                      <div className="icon status-icon">
                        <span>📊</span>
                      </div>
                    </div>
                    <div className="status-name">{item.status}</div>
                    <div className="status-count">{item.total}</div>
                  </div>
                ))
              ) : (
                <div className="no-data-message">
                  <p>Nenhum resultado encontrado</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {!isLoading && !error && activeView === 'airports' && (
          <div className="airports-results">
            <h3>Aeroportos próximos</h3>
            <p className="airports-description">
              Mostra aeroportos próximos em um raio de até 100 km
            </p>
            
            <div className="search-container">
              <input 
                type="text"
                placeholder="Nome do local"
                className="airport-search"
                value={cidadeBusca}
                onChange={(e) => setCidadeBusca(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscarAeroportos()}
              />
              <button className="search-button" onClick={handleBuscarAeroportos}>
                Buscar
              </button>
            </div>
            
            <div className="airports-list">
              {aeroportos.length > 0 ? (
                aeroportos.map((aeroporto, index) => (
                  <div key={index} className="airport-item">
                    <div className="airport-icon-container">
                      <div className="icon airport-icon">
                        <span>✈️</span>
                      </div>
                    </div>
                    <div className="airport-info">
                      <div className="airport-name">{aeroporto.nome_aeroporto}</div>
                      <div className="airport-city">{aeroporto.cidade_aeroporto}</div>
                      <div className="airport-code">{aeroporto.codigo_iata}</div>
                    </div>
                    <div className="airport-distance">{aeroporto.distancia_km.toFixed(1)} km</div>
                  </div>
                ))
              ) : (
                ultimaCidadeBuscada && (
                  <div className="no-data-message">
                    <p>Nenhum aeroporto encontrado para "{ultimaCidadeBuscada}"</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {!isLoading && !error && activeView === 'races' && (
          <div className="races-results">
            <h3>Corridas por circuito</h3>
            <p className="races-description">
              A ideia é fazer uma análise resumida e hierárquica das corridas realizadas.
            </p>
            
            <div className="races-table">
              <div className="races-table-header">
                <div className="header-item">Circuito</div>
                <div className="header-item">Corridas</div>
                <div className="header-item">Min. Voltas</div>
                <div className="header-item">Média Voltas</div>
                <div className="header-item">Max Voltas</div>
                <div className="header-item"></div>
              </div>
              
              {corridasPorCircuito.length > 0 ? (
                corridasPorCircuito.map((circuit, index) => (
                  <div key={index} className="circuit-group">
                    <div className="circuit-row">
                      <div className="circuit-info">
                        <div className="circuit-icon">
                          <span>🏁</span>
                        </div>
                        <span className="circuit-name">{circuit.circuito}</span>
                      </div>
                      <div className="circuit-data">{circuit.qtd_corridas}</div>
                      <div className="circuit-data">{circuit.min_voltas}</div>
                      <div className="circuit-data">{circuit.media_voltas}</div>
                      <div className="circuit-data">{circuit.max_voltas}</div>
                      <div className="circuit-toggle">
                        <button 
                          className="toggle-button"
                          onClick={() => toggleCircuit(circuit.circuitid, circuit.circuito)}
                        >
                          {expandedCircuits[circuit.circuitid] ? 'Ver menos' : 'Ver mais'}
                          <span className={`arrow ${expandedCircuits[circuit.circuitid] ? 'up' : 'down'}`}>
                            {expandedCircuits[circuit.circuitid] ? '▲' : '▼'}
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    {expandedCircuits[circuit.circuitid] && corridasDetalhadas[circuit.circuitid] && (
                      <div className="circuit-details">
                        <div className="details-header">
                          <div className="detail-header-item">Nome da Corrida</div>
                          <div className="detail-header-item">Data</div>
                          <div className="detail-header-item">Voltas</div>
                          <div className="detail-header-item">Horário</div>
                        </div>
                        
                        {corridasDetalhadas[circuit.circuitid].map((detail, detailIndex) => (
                          <div key={detailIndex} className="detail-row">
                            <div className="detail-icon">
                              <div className="race-detail-icon">
                                <span>🏎️</span>
                              </div>
                            </div>
                            <div className="detail-data">{detail.corrida}</div>
                            <div className="detail-data">{new Date(detail.date).toLocaleDateString('pt-BR')}</div>
                            <div className="detail-data">{detail.laps}</div>
                            <div className="detail-data">{detail.time || 'N/A'}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-data-message">
                  <p>Nenhuma corrida encontrada</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports; 