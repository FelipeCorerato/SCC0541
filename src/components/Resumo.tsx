import React from 'react';
import '../styles/Resumo.css';

const Resumo: React.FC = () => {
  return (
    <div className="resumo-content">
      <h1>Resumo</h1>

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

      {/* Accordion sections */}
      <div className="accordion-section">
        <div className="accordion-header">
          <h2>Corridas em 2025</h2>
          <span>▼</span>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Corrida</th>
                <th>Voltas</th>
                <th>Tempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="race-info">
                    <div className="icon race-icon">
                      <span>🏎️</span>
                    </div>
                    <span>Corrida da Makonha</span>
                  </div>
                </td>
                <td>15</td>
                <td>1:23:45</td>
              </tr>
              <tr>
                <td>
                  <div className="race-info">
                    <div className="icon race-icon">
                      <span>🏎️</span>
                    </div>
                    <span>Corrida da Pamonha</span>
                  </div>
                </td>
                <td>69</td>
                <td>4:20:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="accordion-section">
        <div className="accordion-header">
          <h2>Escudeiras em 2025</h2>
          <span>▼</span>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="team-info">
                    <div className="icon team-icon">
                      <span>🏁</span>
                    </div>
                    <span>Tronca Verde</span>
                  </div>
                </td>
                <td>100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="accordion-section">
        <div className="accordion-header">
          <h2>Pilotos em 2025</h2>
          <span>▼</span>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="driver-info">
                    <div className="icon driver-icon">
                      <span>👨‍🏁</span>
                    </div>
                    <span>Seu Makonha</span>
                  </div>
                </td>
                <td>420</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resumo; 