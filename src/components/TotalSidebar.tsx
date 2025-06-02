import React from 'react';
import '../styles/TotalSidebar.css';

interface TotalSidebarProps {
  // Props if needed
}

const TotalSidebar: React.FC<TotalSidebarProps> = () => {
  return (
    <div className="total-sidebar">
      <div className="total-header">
        <h2>Total</h2>
      </div>
      
      <div className="total-cards">
        <div className="total-card">
          <div className="icon driver-icon">
            <span>👤</span>
          </div>
          <div className="total-content">
            <h3>Pilotos</h3>
            <p>10</p>
          </div>
        </div>
        
        <div className="total-card">
          <div className="icon team-icon">
            <span>🏎️</span>
          </div>
          <div className="total-content">
            <h3>Escudeiras</h3>
            <p>50</p>
          </div>
        </div>
        
        <div className="total-card">
          <div className="icon season-icon">
            <span>⏱️</span>
          </div>
          <div className="total-content">
            <h3>Temporadas</h3>
            <p>100</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalSidebar; 