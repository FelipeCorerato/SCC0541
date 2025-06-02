import React from 'react';
import '../styles/Relatorios.css';

const Relatorios: React.FC = () => {
  return (
    <div className="relatorios-content">
      <h1>Relatórios</h1>
      
      <div className="relatorios-section">
        <h2>Relatórios disponíveis</h2>
        
        <div className="relatorios-cards">
          <div className="relatorio-card">
            <div className="relatorio-icon">
              <span>📊</span>
            </div>
            <div className="relatorio-details">
              <h3>Desempenho de pilotos</h3>
              <p>Estatísticas detalhadas de cada piloto na temporada atual</p>
              <button className="download-button">Baixar relatório</button>
            </div>
          </div>
          
          <div className="relatorio-card">
            <div className="relatorio-icon">
              <span>📈</span>
            </div>
            <div className="relatorio-details">
              <h3>Ranking de escudeiras</h3>
              <p>Classificação atual das escudeiras e pontuação</p>
              <button className="download-button">Baixar relatório</button>
            </div>
          </div>
          
          <div className="relatorio-card">
            <div className="relatorio-icon">
              <span>🏁</span>
            </div>
            <div className="relatorio-details">
              <h3>Histórico de corridas</h3>
              <p>Resultados detalhados de todas as corridas da temporada</p>
              <button className="download-button">Baixar relatório</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios; 