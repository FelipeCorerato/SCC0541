import React, { useState, useEffect } from 'react';
import { getPilotoEstatisticasAnoCircuito, type PilotoEstatisticasAnoCircuito } from '../services/drivers';
import type { User } from '../services/auth';
import '../styles/Resumo.css';

interface PilotoResumoProps {
  user?: User | null;
}

const PilotoResumo: React.FC<PilotoResumoProps> = ({ user }) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [estatisticas, setEstatisticas] = useState<PilotoEstatisticasAnoCircuito[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Carregar dados quando o componente montar
  useEffect(() => {
    loadEstatisticas();
  }, [user]);

  const loadEstatisticas = async () => {
    if (!user || !user.idoriginal) {
      setError('Usuário não identificado ou ID do piloto não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getPilotoEstatisticasAnoCircuito(user.idoriginal);
      setEstatisticas(data);
      
      // Expandir automaticamente as seções dos anos encontrados
      const anosEncontrados = [...new Set(data.map(item => item.ano.toString()))];
      const initialExpanded: {[key: string]: boolean} = {};
      anosEncontrados.forEach(ano => {
        initialExpanded[ano] = true;
      });
      setExpandedSections(initialExpanded);
      
    } catch (err) {
      setError('Erro ao carregar estatísticas do piloto');
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Organizar dados por ano
  const dadosPorAno = estatisticas.reduce((acc, item) => {
    const ano = item.ano.toString();
    if (!acc[ano]) {
      acc[ano] = [];
    }
    acc[ano].push(item);
    return acc;
  }, {} as {[ano: string]: PilotoEstatisticasAnoCircuito[]});

  // Ordenar anos em ordem decrescente
  const anosOrdenados = Object.keys(dadosPorAno).sort((a, b) => parseInt(b) - parseInt(a));

  // Dados para o gráfico (usando os pontos totais por ano)
  const dadosGrafico = anosOrdenados.map(ano => {
    const totalPontosAno = dadosPorAno[ano].reduce((sum, item) => sum + item.total_pontos, 0);
    return totalPontosAno;
  });

  const maxPontos = Math.max(...dadosGrafico, 1);

  return (
    <div className="summary-content">
      <h1>Resumo</h1>
      <p className="subtitle">Resultados do piloto para cada ano e circuito</p>

      {/* Loading */}
      {isLoading && (
        <div className="loading-message">
          <p>Carregando estatísticas...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadEstatisticas} className="retry-button">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Chart */}
      {!isLoading && !error && dadosGrafico.length > 0 && (
        <div className="chart-container">
          <div className="chart-placeholder">
            {dadosGrafico.map((pontos, index) => (
              <div 
                key={index} 
                className="chart-bar" 
                style={{ 
                  height: `${(pontos / maxPontos) * 80 + 20}px`,
                  backgroundColor: index === 0 ? '#4285f4' : '#e0e8ff'
                }}
                title={`${anosOrdenados[index]}: ${pontos} pontos`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Seções por ano */}
      {!isLoading && !error && anosOrdenados.map(ano => (
        <div key={ano} className="accordion-section">
          <div 
            className="accordion-header" 
            onClick={() => toggleSection(ano)}
            style={{ cursor: 'pointer' }}
          >
            <h2>Circuitos em {ano}</h2>
            <span>{expandedSections[ano] ? '▼' : '▶'}</span>
          </div>
          
          {expandedSections[ano] && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Circuito</th>
                    <th>Pontos</th>
                    <th>Vitórias</th>
                    <th>Corridas</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosPorAno[ano].map((resultado, index) => (
                    <tr key={index}>
                      <td>
                        <div className="race-info">
                          <div className="icon race-icon">
                            <span>🏎️</span>
                          </div>
                          <span>{resultado.circuito_nome}</span>
                        </div>
                      </td>
                      <td>{resultado.total_pontos}</td>
                      <td>{resultado.total_vitorias}</td>
                      <td>{resultado.total_corridas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Estado vazio */}
      {!isLoading && !error && estatisticas.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>Nenhuma estatística encontrada para este piloto</p>
        </div>
      )}
    </div>
  );
};

export default PilotoResumo; 