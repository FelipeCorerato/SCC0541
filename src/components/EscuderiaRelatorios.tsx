import React, { useState } from 'react';
import '../styles/Relatorios.css';

const EscuderiaRelatorios: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'victories'>('status');
  const [activeView, setActiveView] = useState<'status' | 'victories'>('status');

  // Toggle between views when a tab is clicked
  const handleTabClick = (tab: 'status' | 'victories') => {
    setActiveTab(tab);
    setActiveView(tab);
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
              
              <div className="status-table">
                <div className="status-table-header">
                  <div className="status-header-item">Status</div>
                  <div className="status-header-item">Quantidade</div>
                </div>
                
                <div className="status-list">
                  <div className="status-item">
                    <div className="status-icon-container">
                      <div className="icon status-icon">
                        <span>📊</span>
                      </div>
                    </div>
                    <div className="status-name">Vitória</div>
                    <div className="status-count">25</div>
                  </div>
                  
                  <div className="status-item">
                    <div className="status-icon-container">
                      <div className="icon status-icon">
                        <span>📊</span>
                      </div>
                    </div>
                    <div className="status-name">Abandono</div>
                    <div className="status-count">25</div>
                  </div>
                  
                  <div className="status-item">
                    <div className="status-icon-container">
                      <div className="icon status-icon">
                        <span>📊</span>
                      </div>
                    </div>
                    <div className="status-name">Desclassificado</div>
                    <div className="status-count">25</div>
                  </div>
                  
                  <div className="status-item">
                    <div className="status-icon-container">
                      <div className="icon status-icon">
                        <span>📊</span>
                      </div>
                    </div>
                    <div className="status-name">Não Largou</div>
                    <div className="status-count">25</div>
                  </div>
                  
                  <div className="status-item">
                    <div className="status-icon-container">
                      <div className="icon status-icon">
                        <span>📊</span>
                      </div>
                    </div>
                    <div className="status-name">Não Terminou</div>
                    <div className="status-count">25</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'victories' && (
            <div className="victories-results">
              <h3>Pilotos e Vitórias</h3>
              <p className="victories-description">
                Relatório dos pilotos da escuderia e suas vitórias em corridas.
              </p>
              
              <div className="victories-list">
                <div className="victory-item">
                  <div className="victory-icon-container">
                    <div className="icon race-icon">
                      <span>🏆</span>
                    </div>
                  </div>
                  <div className="victory-info">
                    <div className="pilot-name">Lewis Hamilton</div>
                    <div className="victory-count">15 vitórias</div>
                  </div>
                </div>
                
                <div className="victory-item">
                  <div className="victory-icon-container">
                    <div className="icon race-icon">
                      <span>🏆</span>
                    </div>
                  </div>
                  <div className="victory-info">
                    <div className="pilot-name">George Russell</div>
                    <div className="victory-count">8 vitórias</div>
                  </div>
                </div>
                
                <div className="victory-item">
                  <div className="victory-icon-container">
                    <div className="icon race-icon">
                      <span>🏆</span>
                    </div>
                  </div>
                  <div className="victory-info">
                    <div className="pilot-name">Valtteri Bottas</div>
                    <div className="victory-count">12 vitórias</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscuderiaRelatorios; 