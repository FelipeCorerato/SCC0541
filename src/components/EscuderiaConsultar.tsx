import React, { useState } from 'react';
import { getDriversByForenameAndConstructor, type DriverByForenameAndConstructor } from '../services/drivers';
import type { User } from '../services/auth';
import '../styles/EscuderiaConsultar.css';

interface EscuderiaConsultarProps {
  user?: User | null;
}

const EscuderiaConsultar: React.FC<EscuderiaConsultarProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pilotos, setPilotos] = useState<DriverByForenameAndConstructor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim() || !user?.idoriginal) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await getDriversByForenameAndConstructor(searchTerm.trim(), user.idoriginal);
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
            Consulta pilotos que já correram pela sua escuderia, exibindo seus dados
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
              disabled={isLoading || !searchTerm.trim() || !user?.idoriginal}
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
            
            {pilotos.map((piloto, index) => (
              <div key={index} className="table-row">
                <div className="table-cell">
                  <div className="pilot-info">
                    <div className="pilot-avatar">
                      <span>👤</span>
                    </div>
                    <span>{piloto.full_name}</span>
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
            <p>Nenhum piloto encontrado com o nome "{searchTerm}" que tenha corrido pela sua escuderia</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscuderiaConsultar; 