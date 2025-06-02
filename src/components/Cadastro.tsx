import React, { useState } from 'react';
import '../styles/Cadastro.css';

interface CadastroProps {
  // Props if needed
}

const Cadastro: React.FC<CadastroProps> = () => {
  const [activeTab, setActiveTab] = useState<'piloto' | 'escudeira'>('piloto');
  
  // Form state
  const [driverForm, setDriverForm] = useState({
    nome: 'João',
    sobrenome: 'do Gás',
    numeroCarro: 'oahsoadojgash',
    nacionalidade: 'do Gás',
    dataNascimento: '25/12/2025',
    usuario: 'Joao_do_gas',
    codigoPiloto: '666',
    sitePessoal: 'www.joaodogas.com.br'
  });

  const handleDriverFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDriverForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário de piloto enviado:', driverForm);
    // Aqui você trataria o envio do formulário (chamada API, etc.)
  };

  return (
    <>
      <div className="cadastro-content">
        <h1>Cadastro</h1>

        <div className="cadastro-section">
          <h2>Cadastrar</h2>
          
          <div className="cadastro-tabs">
            <div 
              className={`tab ${activeTab === 'piloto' ? 'active' : ''}`}
              onClick={() => setActiveTab('piloto')}
            >
              <div className="icon driver-icon">
                <span>👤</span>
              </div>
              <span>Piloto</span>
            </div>
            
            <div 
              className={`tab ${activeTab === 'escudeira' ? 'active' : ''}`}
              onClick={() => setActiveTab('escudeira')}
            >
              <div className="icon team-icon">
                <span>🏎️</span>
              </div>
              <span>Escudeira</span>
            </div>
          </div>

          {activeTab === 'piloto' && (
            <div className="form-container">
              <h3>Dados do piloto</h3>
              
              <form onSubmit={handleDriverSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome</label>
                    <input 
                      type="text" 
                      name="nome"
                      value={driverForm.nome}
                      onChange={handleDriverFormChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Sobrenome</label>
                    <input 
                      type="text" 
                      name="sobrenome"
                      value={driverForm.sobrenome}
                      onChange={handleDriverFormChange}
                    />
                  </div>
                </div>
                
                <div className="form-row three-columns">
                  <div className="form-group">
                    <label>Número do carro</label>
                    <input 
                      type="text" 
                      name="numeroCarro"
                      value={driverForm.numeroCarro}
                      onChange={handleDriverFormChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nacionalidade</label>
                    <input 
                      type="text" 
                      name="nacionalidade"
                      value={driverForm.nacionalidade}
                      onChange={handleDriverFormChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Data de nascimento</label>
                    <input 
                      type="text" 
                      name="dataNascimento"
                      value={driverForm.dataNascimento}
                      onChange={handleDriverFormChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Usuário</label>
                    <input 
                      type="text" 
                      name="usuario"
                      value={driverForm.usuario}
                      onChange={handleDriverFormChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Código do piloto</label>
                    <input 
                      type="text" 
                      name="codigoPiloto"
                      value={driverForm.codigoPiloto}
                      onChange={handleDriverFormChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Site pessoal</label>
                    <input 
                      type="text" 
                      name="sitePessoal"
                      value={driverForm.sitePessoal}
                      onChange={handleDriverFormChange}
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Cadastrar piloto
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'escudeira' && (
            <div className="form-container">
              <h3>Dados da escudeira</h3>
              <p>Formulário de cadastro de escudeira será implementado aqui.</p>
            </div>
          )}
        </div>
      </div>

      {/* A sidebar direita é implementada no App.tsx */}
    </>
  );
};

export default Cadastro; 