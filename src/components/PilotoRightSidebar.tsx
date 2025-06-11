import React, { useState, useEffect } from 'react';
import { getPilotoAnosAtividade, type PilotoAnosAtividade } from '../services/drivers';
import { type User } from '../services/auth';
import '../styles/TotalSidebar.css';

interface PilotoRightSidebarProps {
  user?: User | null;
}

const PilotoRightSidebar: React.FC<PilotoRightSidebarProps> = ({ user }) => {
  const [anosAtividade, setAnosAtividade] = useState<PilotoAnosAtividade | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados quando o componente montar
  useEffect(() => {
    loadAnosAtividade();
  }, [user]);

  const loadAnosAtividade = async () => {
    if (!user || !user.idoriginal) {
      setError('Usuário não identificado ou ID do piloto não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getPilotoAnosAtividade(user.idoriginal);
      setAnosAtividade(data);
    } catch (err) {
      setError('Erro ao carregar dados de atividade do piloto');
      console.error('Erro ao carregar anos de atividade:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="total-sidebar">
      <div className="total-header">
        <h2>Atuações</h2>
      </div>
      
      <div className="total-cards">
        <div className="total-card">
          <div className="icon team-icon" style={{ backgroundColor: '#ff9800' }}>
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

export default PilotoRightSidebar; 