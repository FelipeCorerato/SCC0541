import React from 'react';
import '../styles/Sidebar.css';
import type { User } from '../services/auth';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  user?: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate, onLogout, user }) => {
  const getUserDisplayName = () => {
    if (!user) return 'Usuário';
    
    // Se for administrador, mostra "Admin"
    if (user.tipo === 'Administrador') return 'Admin';
    
    // Caso contrário, mostra o login
    return user.login;
  };

  const getUserAvatar = () => {
    // Se for administrador, usa avatar feminino
    if (user?.tipo === 'Administrador') {
      return "https://randomuser.me/api/portraits/women/44.jpg";
    }
    // Para outros usuários, usa avatar masculino
    return "https://randomuser.me/api/portraits/men/32.jpg";
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
            className={activeScreen === 'cadastros' ? 'active' : ''} 
            onClick={() => onNavigate('cadastros')}
          >
            Cadastros
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

export default Sidebar; 