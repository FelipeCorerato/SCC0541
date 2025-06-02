import React from 'react';
import '../styles/Sidebar.css';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate, onLogout }) => {
  return (
    <div className="sidebar">
      <div className="logout-button">
        <button onClick={onLogout}>
          <span>↩</span> Sair
        </button>
      </div>

      <div className="admin-profile">
        <div className="avatar">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Admin" />
        </div>
        <h2>Admin</h2>
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