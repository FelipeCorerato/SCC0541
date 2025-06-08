import React from 'react';
import '../styles/EscuderiaConsultar.css';

const EscuderiaCadastrar: React.FC = () => {
  return (
    <div className="escuderia-consultar">
      <h1>Cadastrar</h1>

      <div className="search-section-container">
        <div className="search-section">
          <h2>Cadastrar novo piloto</h2>
          <p className="search-description">
            Cadastre novos pilotos para sua escuderia
          </p>
          
          <div className="no-results">
            <div className="empty-icon">🚧</div>
            <p>Funcionalidade de cadastro em desenvolvimento...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscuderiaCadastrar; 