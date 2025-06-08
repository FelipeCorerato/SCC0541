import React from 'react';
import '../styles/Sidebar.css';
import type { User } from '../services/auth';

interface EscuderiaSidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  user?: User | null;
}

const EscuderiaSidebar: React.FC<EscuderiaSidebarProps> = ({ activeScreen, onNavigate, onLogout, user }) => {
  const getUserDisplayName = () => {
    if (!user) return 'Escuderia';
    return user.login;
  };

  const getUserAvatar = () => {
    return "https://randomuser.me/api/portraits/women/68.jpg";
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
            className={activeScreen === 'consultar' ? 'active' : ''} 
            onClick={() => onNavigate('consultar')}
          >
            Consultar
          </li>
          <li 
            className={activeScreen === 'cadastrar' ? 'active' : ''} 
            onClick={() => onNavigate('cadastrar')}
          >
            Cadastrar
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

export default EscuderiaSidebar; 