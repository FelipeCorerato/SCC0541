import React, { useState, useEffect } from 'react';
import '../styles/Resumo.css';
import { getRaces, type Race } from '../services/races';
import { getDrivers, type Driver } from '../services/drivers';
import { getConstructors, type Constructor } from '../services/constructors';

const Summary: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [racesData, driversData, constructorsData] = await Promise.all([
          getRaces(),
          getDrivers(),
          getConstructors()
        ]);
        
        setRaces(racesData);
        setDrivers(driversData);
        setConstructors(constructorsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="summary-content">
        <h1>Resumo</h1>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="summary-content">
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
          {races.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Round</th>
                  <th>Data</th>
                  <th>Horário</th>
                </tr>
              </thead>
              <tbody>
                {races.map((race) => (
                  <tr key={race.raceid}>
                    <td>
                      <div className="race-info">
                        <div className="icon race-icon">
                          <span>🏎️</span>
                        </div>
                        <span>{race.name}</span>
                      </div>
                    </td>
                    <td>{race.round}</td>
                    <td>{new Date(race.date).toLocaleDateString('pt-BR')}</td>
                    <td>{race.time || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏁</div>
              <p>Nenhuma corrida encontrada para 2025</p>
            </div>
          )}
        </div>
      </div>

      <div className="accordion-section">
        <div className="accordion-header">
          <h2>Escudeiras em 2025</h2>
          <span>▼</span>
        </div>
        
        <div className="table-container">
          {constructors.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Nacionalidade</th>
                </tr>
              </thead>
              <tbody>
                {constructors.map((constructor) => (
                  <tr key={constructor.constructorid}>
                    <td>
                      <div className="team-info">
                        <div className="icon team-icon">
                          <span>🏁</span>
                        </div>
                        <span>{constructor.name}</span>
                      </div>
                    </td>
                    <td>{constructor.nationality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏎️</div>
              <p>Nenhuma escudeira encontrada para 2025</p>
            </div>
          )}
        </div>
      </div>

      <div className="accordion-section">
        <div className="accordion-header">
          <h2>Pilotos em 2025</h2>
          <span>▼</span>
        </div>
        
        <div className="table-container">
          {drivers.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Nacionalidade</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.driverid}>
                    <td>
                      <div className="driver-info">
                        <div className="icon driver-icon">
                          <span>👨‍🏁</span>
                        </div>
                        <span>{driver.forename} {driver.surname}</span>
                      </div>
                    </td>
                    <td>{driver.nationality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👨‍🏁</div>
              <p>Nenhum piloto encontrado para 2025</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary; 