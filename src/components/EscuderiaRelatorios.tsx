import React, { useState, useEffect } from 'react';
import { getEscuderiaResultadosPorStatus, getEscuderiaPilotosVitorias, type EscuderiaStatus, type EscuderiaPilotoVitorias } from '../services/constructors';
import type { User } from '../services/auth';
import '../styles/Relatorios.css';

interface EscuderiaRelatoriosProps {
  user?: User | null;
}

const EscuderiaRelatorios: React.FC<EscuderiaRelatoriosProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'victories'>('status');
  const [activeView, setActiveView] = useState<'status' | 'victories'>('status');
  const [statusData, setStatusData] = useState<EscuderiaStatus[]>([]);
  const [victoryData, setVictoryData] = useState<EscuderiaPilotoVitorias[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle between views when a tab is clicked
  const handleTabClick = (tab: 'status' | 'victories') => {
    setActiveTab(tab);
    setActiveView(tab);
  };

  // Carregar dados de status quando o componente montar ou quando a aba status for ativada
  useEffect(() => {
    if (activeView === 'status') {
      loadStatusData();
    } else if (activeView === 'victories') {
      loadVictoryData();
    }
  }, [activeView, user]);

  const loadStatusData = async () => {
    if (!user || !user.idoriginal) {
      setError('Usuário não identificado ou ID da escuderia não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getEscuderiaResultadosPorStatus(user.idoriginal);
      setStatusData(data);
    } catch (err) {
      setError('Erro ao carregar dados de status da escuderia');
      console.error('Erro ao carregar status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVictoryData = async () => {
    if (!user || !user.idoriginal) {
      setError('Usuário não identificado ou ID da escuderia não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getEscuderiaPilotosVitorias(user.idoriginal);
      setVictoryData(data);
    } catch (err) {
      setError('Erro ao carregar dados de vitórias dos pilotos');
      console.error('Erro ao carregar vitórias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reports-content escuderia-layout">
      <h1>Relatórios</h1>
      
      <div className="escuderia-content-wrapper">
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
              <span>Status da Escuderia</span>
            </div>
            
            <div 
              className={`tab ${activeTab === 'victories' ? 'active' : ''}`}
              onClick={() => handleTabClick('victories')}
            >
              <div className="icon race-icon">
                <span>🏆</span>
              </div>
              <span>Pilotos e Vitórias</span>
            </div>
          </div>
          
          {activeView === 'status' && (
            <div className="status-results">
              <h3>Status da Escuderia</h3>
              <p className="status-description">
                Mostrar quantas vezes cada tipo de resultado aconteceu com os carros da escuderia em todas as corridas.
              </p>
              
              {isLoading && (
                <div className="loading-message">
                  <p>Carregando dados...</p>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={loadStatusData} className="retry-button">
                    Tentar novamente
                  </button>
                </div>
              )}

              {!isLoading && !error && (
                <div className="status-table">
                  <div className="status-table-header">
                    <div className="status-header-item">Status</div>
                    <div className="status-header-item">Quantidade</div>
                  </div>
                  
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
                      // Estado vazio com status zerados
                      <>
                        <div className="status-item">
                          <div className="status-icon-container">
                            <div className="icon status-icon">
                              <span>📊</span>
                            </div>
                          </div>
                          <div className="status-name">Finished</div>
                          <div className="status-count">0</div>
                        </div>
                        
                        <div className="status-item">
                          <div className="status-icon-container">
                            <div className="icon status-icon">
                              <span>📊</span>
                            </div>
                          </div>
                          <div className="status-name">Accident</div>
                          <div className="status-count">0</div>
                        </div>
                        
                        <div className="status-item">
                          <div className="status-icon-container">
                            <div className="icon status-icon">
                              <span>📊</span>
                            </div>
                          </div>
                          <div className="status-name">Engine</div>
                          <div className="status-count">0</div>
                        </div>
                        
                        <div className="status-item">
                          <div className="status-icon-container">
                            <div className="icon status-icon">
                              <span>📊</span>
                            </div>
                          </div>
                          <div className="status-name">Retired</div>
                          <div className="status-count">0</div>
                        </div>
                        
                        <div className="status-item">
                          <div className="status-icon-container">
                            <div className="icon status-icon">
                              <span>📊</span>
                            </div>
                          </div>
                          <div className="status-name">Disqualified</div>
                          <div className="status-count">0</div>
                        </div>
                        
                        <div className="status-item">
                          <div className="status-icon-container">
                            <div className="icon status-icon">
                              <span>📊</span>
                            </div>
                          </div>
                          <div className="status-name">Did not qualify</div>
                          <div className="status-count">0</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeView === 'victories' && (
            <div className="victories-results">
              <h3>Pilotos e Vitórias</h3>
              <p className="victories-description">
                Relatório dos pilotos da escuderia e suas vitórias em corridas.
              </p>
              
              {isLoading && (
                <div className="loading-message">
                  <p>Carregando dados...</p>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={loadVictoryData} className="retry-button">
                    Tentar novamente
                  </button>
                </div>
              )}

              {!isLoading && !error && (
                <div className="victories-list">
                  {victoryData.length > 0 ? (
                    victoryData.map((item, index) => (
                      <div key={index} className="victory-item">
                        <div className="victory-icon-container">
                          <div className="icon race-icon">
                            <span>🏆</span>
                          </div>
                        </div>
                        <div className="victory-info">
                          <div className="pilot-name">{item.piloto}</div>
                          <div className="victory-count">{item.vitorias} {item.vitorias === 1 ? 'vitória' : 'vitórias'}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data-message">
                      <p>Nenhuma vitória encontrada para os pilotos desta escuderia.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscuderiaRelatorios; 