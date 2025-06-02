import React, { useState } from 'react';
import '../styles/Relatorios.css';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'airports'>('status');
  const [activeView, setActiveView] = useState<'status' | 'airports'>('status');

  // Toggle between views when a tab is clicked
  const handleTabClick = (tab: 'status' | 'airports') => {
    setActiveTab(tab);
    setActiveView(tab);
  };

  return (
    <div className="reports-content">
      <h1>Relatórios</h1>
      
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
          
          <div className="tab">
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
      </div>
    </div>
  );
};

export default Reports; 