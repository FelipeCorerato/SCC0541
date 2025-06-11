import React from 'react';
import '../styles/Sidebar.css';
import type { User } from '../services/auth';

interface PilotoSidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  user?: User | null;
}

const PilotoSidebar: React.FC<PilotoSidebarProps> = ({ activeScreen, onNavigate, onLogout, user }) => {
  const getUserDisplayName = () => {
    if (!user) return 'Piloto';
    return user.login;
  };

  const getUserAvatar = () => {
    // Avatar específico para piloto - imagem de um piloto
    return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop&crop=face";
  };

  return (
    <div className="sidebar">
      <div className="logout-button">
        <button onClick={onLogout}>
          <span>↩</span> Sair
        </button>
      </div>

      <div className="admin-profile">
        <div className="avatar">
          <img src={getUserAvatar()} alt={getUserDisplayName()} />
        </div>
        <h2>{getUserDisplayName()}</h2>
        {user && (
          <p className="user-type">{user.tipo}</p>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li 
            className={activeScreen === 'resumo' ? 'active' : ''} 
            onClick={() => onNavigate('resumo')}
          >
            Resumo
          </li>
          <li 
            className={activeScreen === 'relatorios' ? 'active' : ''} 
            onClick={() => onNavigate('relatorios')}
          >
            Relatórios
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PilotoSidebar; 