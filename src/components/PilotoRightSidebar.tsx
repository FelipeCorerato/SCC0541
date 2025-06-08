import React from 'react';
import '../styles/TotalSidebar.css';

interface PilotoRightSidebarProps {
  // Props if needed
}

const PilotoRightSidebar: React.FC<PilotoRightSidebarProps> = () => {
  return (
    <div className="total-sidebar">
      <div className="total-header">
        <h2>Atuações</h2>
      </div>
      
      <div className="total-cards">
        <div className="total-card">
          <div className="icon driver-icon" style={{ backgroundColor: '#9c27b0' }}>
            <span>🏆</span>
          </div>
          <div className="total-content">
            <h3>Escudeira</h3>
            <p>Jamaica</p>
          </div>
        </div>
        
        <div className="total-card">
          <div className="icon team-icon" style={{ backgroundColor: '#ff9800' }}>
            <span>🏁</span>
          </div>
          <div className="total-content">
            <h3>Primeira Atuação</h3>
            <p>2021</p>
          </div>
        </div>
        
        <div className="total-card">
          <div className="icon season-icon" style={{ backgroundColor: '#795548' }}>
            <span>⏱️</span>
          </div>
          <div className="total-content">
            <h3>Última Atuação</h3>
            <p>2022</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilotoRightSidebar; 