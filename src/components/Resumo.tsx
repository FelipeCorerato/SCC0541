import React, { useState, useEffect } from 'react';
import '../styles/Resumo.css';
import { getRaces, type Race } from '../services/races';
import { getDrivers, type Driver } from '../services/drivers';
import { getConstructors, type Constructor } from '../services/constructors';
import { showError } from '../utils/toast';

const Summary: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({
    races: true,
    constructors: true,
    drivers: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
        showError('Erro ao carregar dados do resumo. Tente novamente.');
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
        <div 
          className="accordion-header" 
          onClick={() => toggleSection('races')}
          style={{ cursor: 'pointer' }}
        >
          <h2>Corridas em 2025</h2>
          <span>{openSections.races ? '▲' : '▼'}</span>
        </div>
        
        {openSections.races && (
          <div className="table-container">
            {races.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Data</th>
                    <th>Total de Voltas</th>
                    <th>Tempo Total</th>
                  </tr>
                </thead>
                <tbody>
                  {races.map((race) => (
                    <tr key={race.race_id}>
                      <td>
                        <div className="race-info">
                          <div className="icon race-icon">
                            <span>🏎️</span>
                          </div>
                          <span>{race.race_name}</span>
                        </div>
                      </td>
                      <td>{new Date(race.race_date).toLocaleDateString('pt-BR')}</td>
                      <td>{race.total_laps}</td>
                      <td>
                        {race.total_time > 0 
                          ? (() => {
                              const totalSeconds = Math.floor(race.total_time / 1000);
                              const hours = Math.floor(totalSeconds / 3600);
                              const minutes = Math.floor((totalSeconds % 3600) / 60);
                              const seconds = totalSeconds % 60;
                              
                              if (hours > 0) {
                                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                              } else {
                                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                              }
                            })()
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏁</div>
                <p>Nenhuma corrida encontrada para {new Date().getFullYear()}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="accordion-section">
        <div 
          className="accordion-header" 
          onClick={() => toggleSection('constructors')}
          style={{ cursor: 'pointer' }}
        >
          <h2>Escudeiras em 2025</h2>
          <span>{openSections.constructors ? '▲' : '▼'}</span>
        </div>
        
        {openSections.constructors && (
          <div className="table-container">
            {constructors.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Total de Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {constructors.map((constructor) => (
                    <tr key={constructor.constructor_id}>
                      <td>
                        <div className="team-info">
                          <div className="icon team-icon">
                            <span>🏁</span>
                          </div>
                          <span>{constructor.constructor_name}</span>
                        </div>
                      </td>
                      <td>{constructor.total_pontos.toFixed(1)} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏎️</div>
                <p>Nenhuma escudeira encontrada para {new Date().getFullYear()}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="accordion-section">
        <div 
          className="accordion-header" 
          onClick={() => toggleSection('drivers')}
          style={{ cursor: 'pointer' }}
        >
          <h2>Pilotos em 2025</h2>
          <span>{openSections.drivers ? '▲' : '▼'}</span>
        </div>
        
        {openSections.drivers && (
          <div className="table-container">
            {drivers.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Total de Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.driver_id}>
                      <td>
                        <div className="driver-info">
                          <div className="icon driver-icon">
                            <span>👨‍🏁</span>
                          </div>
                          <span>{driver.driver_name}</span>
                        </div>
                      </td>
                      <td>{driver.total_pontos.toFixed(1)} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👨‍🏁</div>
                <p>Nenhum piloto encontrado para {new Date().getFullYear()}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary; 