import React, { useState, useEffect } from 'react';
import '../styles/TotalSidebar.css';
import { getAdminSummary, type AdminSummary } from '../services/admin';

interface TotalSidebarProps {
  // Props if needed
}

const TotalSidebar: React.FC<TotalSidebarProps> = () => {
  const [summary, setSummary] = useState<AdminSummary>({
    total_driver: 0,
    total_constructors: 0,
    total_seasons: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await getAdminSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar resumo:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <div className="total-sidebar">
      <div className="total-header">
        <h2>Total</h2>
      </div>
      
      <div className="total-cards">
        <div className="total-card">
          <div className="icon driver-icon">
            <span>👤</span>
          </div>
          <div className="total-content">
            <h3>Pilotos</h3>
            <p>{loading ? '...' : error ? '0' : summary.total_driver}</p>
          </div>
        </div>
        
        <div className="total-card">
          <div className="icon team-icon">
            <span>🏎️</span>
          </div>
          <div className="total-content">
            <h3>Escudeiras</h3>
            <p>{loading ? '...' : error ? '0' : summary.total_constructors}</p>
          </div>
        </div>
        
        <div className="total-card">
          <div className="icon season-icon">
            <span>⏱️</span>
          </div>
          <div className="total-content">
            <h3>Temporadas</h3>
            <p>{loading ? '...' : error ? '0' : summary.total_seasons}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TotalSidebar; 