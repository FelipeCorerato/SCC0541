import React, { useState } from 'react';
import '../styles/EscuderiaConsultar.css';

interface Piloto {
  nome: string;
  nascimento: string;
  nacionalidade: string;
}

const EscuderiaConsultar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dados mockados para demonstração
  const mockPilotos: Piloto[] = [
    {
      nome: 'Seu makonha',
      nascimento: '05/10/1865',
      nacionalidade: 'Butanês'
    },
    {
      nome: 'Seu makonha',
      nascimento: '02/15/2063',
      nacionalidade: 'Jamaicano'
    }
  ];

  const handleSearch = () => {
    setIsLoading(true);
    // Simula uma busca
    setTimeout(() => {
      if (searchTerm.toLowerCase().includes('makonha')) {
        setPilotos(mockPilotos);
      } else {
        setPilotos([]);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
              disabled={isLoading}
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
                    <span>{piloto.nome}</span>
                  </div>
                </div>
                <div className="table-cell">{piloto.nascimento}</div>
                <div className="table-cell">{piloto.nacionalidade}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchTerm && pilotos.length === 0 && !isLoading && (
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