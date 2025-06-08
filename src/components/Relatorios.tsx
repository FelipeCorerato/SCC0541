import React, { useState } from 'react';
import '../styles/Relatorios.css';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'airports' | 'races'>('status');
  const [activeView, setActiveView] = useState<'status' | 'airports' | 'races'>('status');
  const [expandedCircuits, setExpandedCircuits] = useState<{[key: string]: boolean}>({});

  // Toggle between views when a tab is clicked
  const handleTabClick = (tab: 'status' | 'airports' | 'races') => {
    setActiveTab(tab);
    setActiveView(tab);
  };

  // Toggle circuit expansion
  const toggleCircuit = (circuitName: string) => {
    setExpandedCircuits(prev => ({
      ...prev,
      [circuitName]: !prev[circuitName]
    }));
  };

  // Mock data for races
  const circuitsData = [
    {
      name: 'São carlos',
      races: 10,
      minLaps: 100,
      avgLaps: 2,
      maxLaps: 666,
      details: [
        { year: 2018, gp: 'GP do Brasil', laps: 100, totalTime: '2:00:15' },
        { year: 2018, gp: 'GP do Brasil', laps: 100, totalTime: '2:00:15' }
      ]
    },
    {
      name: 'Santa amaro',
      races: 10,
      minLaps: 100,
      avgLaps: 2,
      maxLaps: 666,
      details: []
    }
  ];

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
              <span className="total-value">100</span>
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
        
        {activeView === 'status' && (
          <div className="status-results">
            <h3>Resultados por status</h3>
            <p className="status-description">
              A quantidade de resultados por status significa contar quantas
              vezes cada tipo de resultado final aconteceu em corridas
            </p>
            
            <div className="status-list">
              <div className="status-item">
                <div className="status-icon-container">
                  <div className="icon status-icon">
                    <span>📊</span>
                  </div>
                </div>
                <div className="status-name">Vitória</div>
                <div className="status-count">15</div>
              </div>
              
              <div className="status-item">
                <div className="status-icon-container">
                  <div className="icon status-icon">
                    <span>📊</span>
                  </div>
                </div>
                <div className="status-name">Abandono</div>
                <div className="status-count">10</div>
              </div>
              
              <div className="status-item">
                <div className="status-icon-container">
                  <div className="icon status-icon">
                    <span>📊</span>
                  </div>
                </div>
                <div className="status-name">Desclassificação</div>
                <div className="status-count">4</div>
              </div>
              
              <div className="status-item">
                <div className="status-icon-container">
                  <div className="icon status-icon">
                    <span>📊</span>
                  </div>
                </div>
                <div className="status-name">Não largou</div>
                <div className="status-count">3</div>
              </div>
              
              <div className="status-item">
                <div className="status-icon-container">
                  <div className="icon status-icon">
                    <span>📊</span>
                  </div>
                </div>
                <div className="status-name">Não terminou</div>
                <div className="status-count">56</div>
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'airports' && (
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
                defaultValue="São Makonha"
              />
              <button className="search-button">Buscar</button>
            </div>
            
            <div className="airports-list">
              <div className="airport-item">
                <div className="airport-icon-container">
                  <div className="icon airport-icon">
                    <span>✈️</span>
                  </div>
                </div>
                <div className="airport-name">Aeroporto de Vitória</div>
                <div className="airport-distance">15 km</div>
              </div>
              
              <div className="airport-item">
                <div className="airport-icon-container">
                  <div className="icon airport-icon">
                    <span>✈️</span>
                  </div>
                </div>
                <div className="airport-name">Aeroporto Bob Marley</div>
                <div className="airport-distance">15 km</div>
              </div>
              
              <div className="airport-item">
                <div className="airport-icon-container">
                  <div className="icon airport-icon">
                    <span>✈️</span>
                  </div>
                </div>
                <div className="airport-name">Aeroporto Internacional</div>
                <div className="airport-distance">15 km</div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'races' && (
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
              
              {circuitsData.map((circuit, index) => (
                <div key={index} className="circuit-group">
                  <div className="circuit-row">
                    <div className="circuit-info">
                      <div className="circuit-icon">
                        <span>🏁</span>
                      </div>
                      <span className="circuit-name">{circuit.name}</span>
                    </div>
                    <div className="circuit-data">{circuit.races}</div>
                    <div className="circuit-data">{circuit.minLaps}</div>
                    <div className="circuit-data">{circuit.avgLaps}</div>
                    <div className="circuit-data">{circuit.maxLaps}</div>
                    <div className="circuit-toggle">
                      <button 
                        className="toggle-button"
                        onClick={() => toggleCircuit(circuit.name)}
                      >
                        {expandedCircuits[circuit.name] ? 'Ver menos' : 'Ver mais'}
                        <span className={`arrow ${expandedCircuits[circuit.name] ? 'up' : 'down'}`}>
                          {expandedCircuits[circuit.name] ? '▲' : '▼'}
                        </span>
                      </button>
                    </div>
                  </div>
                  
                  {(expandedCircuits[circuit.name] || circuit.name === 'São carlos') && circuit.details.length > 0 && (
                    <div className="circuit-details">
                      <div className="details-header">
                        <div className="detail-header-item">Ano</div>
                        <div className="detail-header-item">GP</div>
                        <div className="detail-header-item">Voltas</div>
                        <div className="detail-header-item">Tempo Total</div>
                      </div>
                      
                      {circuit.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="detail-row">
                          <div className="detail-icon">
                            <div className="race-detail-icon">
                              <span>🏎️</span>
                            </div>
                          </div>
                          <div className="detail-data">{detail.year}</div>
                          <div className="detail-data">{detail.gp}</div>
                          <div className="detail-data">{detail.laps}</div>
                          <div className="detail-data">{detail.totalTime}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {circuit.name === 'Santa amaro' && (
                    <div className="circuit-details">
                      <div className="circuit-toggle-expanded">
                        <button 
                          className="toggle-button expanded"
                          onClick={() => toggleCircuit(circuit.name)}
                        >
                          Ver mais
                          <span className="arrow down">▼</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports; 