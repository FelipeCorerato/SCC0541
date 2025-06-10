import React, { useState } from 'react';
import { searchDriversByName, type DriverOriginal } from '../services/drivers';
import '../styles/EscuderiaConsultar.css';

const EscuderiaConsultar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pilotos, setPilotos] = useState<DriverOriginal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchDriversByName(searchTerm.trim());
      setPilotos(results);
    } catch (error) {
      console.error('Erro ao buscar pilotos:', error);
      setPilotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="escuderia-consultar">
      <h1>Consultar</h1>
      
      <div className="search-section-container">
        <div className="search-section">
          <h2>Consultar piloto por nome</h2>
          <p className="search-description">
            Consulta pilotos da escuderia, exibindo seus dados
          </p>

          <div className="search-container">
            <input
              type="text"
              placeholder="Informe um nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading || !searchTerm.trim()}
              className="search-button"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>
      </div>

      {pilotos.length > 0 && (
        <div className="results-section-container">
          <div className="results-table">
            <div className="table-header">
              <div className="header-cell">Nome</div>
              <div className="header-cell">Nascimento</div>
              <div className="header-cell">Nacionalidade</div>
            </div>
            
            {pilotos.map((piloto) => (
              <div key={piloto.driverid} className="table-row">
                <div className="table-cell">
                  <div className="pilot-info">
                    <div className="pilot-avatar">
                      <span>👤</span>
                    </div>
                    <span>{piloto.forename} {piloto.surname}</span>
                  </div>
                </div>
                <div className="table-cell">{formatDate(piloto.dob)}</div>
                <div className="table-cell">{piloto.nationality}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasSearched && pilotos.length === 0 && !isLoading && (
        <div className="no-results-container">
          <div className="no-results">
            <div className="empty-icon">🔍</div>
            <p>Nenhum piloto encontrado com o nome "{searchTerm}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscuderiaConsultar; 