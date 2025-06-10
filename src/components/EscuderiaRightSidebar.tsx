import React, { useState, useEffect } from 'react';
import { getEscuderiaTotalVitorias, getEscuderiaTotalPilotos, getEscuderiaAnosAtividade, type EscuderiaAnosAtividade } from '../services/constructors';
import { type User } from '../services/auth';
import '../styles/TotalSidebar.css';

interface EscuderiaRightSidebarProps {
  user?: User | null;
}

const EscuderiaRightSidebar: React.FC<EscuderiaRightSidebarProps> = ({ user }) => {
  const [totalVitorias, setTotalVitorias] = useState<number>(0);
  const [totalPilotos, setTotalPilotos] = useState<number>(0);
  const [anosAtividade, setAnosAtividade] = useState<EscuderiaAnosAtividade | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados quando o componente montar
  useEffect(() => {
    loadEscuderiaData();
  }, [user]);

  const loadEscuderiaData = async () => {
    if (!user || !user.idoriginal) {
      setError('Usuário não identificado ou ID da escuderia não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar todos os dados em paralelo
      const [vitorias, pilotos, anos] = await Promise.all([
        getEscuderiaTotalVitorias(user.idoriginal),
        getEscuderiaTotalPilotos(user.idoriginal),
        getEscuderiaAnosAtividade(user.idoriginal)
      ]);

      setTotalVitorias(vitorias);
      setTotalPilotos(pilotos);
      setAnosAtividade(anos);
    } catch (err) {
      setError('Erro ao carregar dados da escuderia');
      console.error('Erro ao carregar dados da escuderia:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="total-sidebar">
      <div className="total-header">
        <h2>Resumo</h2>
      </div>
      
      <div className="total-cards">
        <div className="total-card">
          <div className="icon driver-icon" style={{ backgroundColor: '#9c27b0' }}>
            <span>🏆</span>
          </div>
          <div className="total-content">
            <h3>Vitórias</h3>
            {isLoading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro</p>
            ) : (
              <p>{totalVitorias}</p>
            )}
          </div>
        </div>
        
        <div className="total-card">
          <div className="icon team-icon" style={{ backgroundColor: '#2196f3' }}>
            <span>👤</span>
          </div>
          <div className="total-content">
            <h3>Pilotos</h3>
            {isLoading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro</p>
            ) : (
              <p>{totalPilotos}</p>
            )}
          </div>
        </div>
        
        <div className="total-card">
          <div className="icon season-icon" style={{ backgroundColor: '#ff9800' }}>
            <span>🏁</span>
          </div>
          <div className="total-content">
            <h3>Primeira Atuação</h3>
            {isLoading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro</p>
            ) : anosAtividade ? (
              <p>{anosAtividade.primeiro_ano}</p>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
        
        <div className="total-card">
          <div className="icon season-icon" style={{ backgroundColor: '#795548' }}>
            <span>⏱️</span>
          </div>
          <div className="total-content">
            <h3>Última Atuação</h3>
            {isLoading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro</p>
            ) : anosAtividade ? (
              <p>{anosAtividade.ultimo_ano}</p>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscuderiaRightSidebar; 