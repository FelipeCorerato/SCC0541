import React, { useState } from 'react';
import '../styles/Cadastro.css';
import { createDriver, type Driver } from '../services/drivers';
import { createConstructor, type Constructor } from '../services/constructors';

interface RecordsProps {
  // Props if needed
}

const Records: React.FC<RecordsProps> = () => {
  const [activeTab, setActiveTab] = useState<'driver' | 'team'>('driver');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form state
  const [driverForm, setDriverForm] = useState({
    nome: '',
    sobrenome: '',
    numeroCarro: '',
    nacionalidade: '',
    dataNascimento: '',
    usuario: '',
    codigoPiloto: '',
    sitePessoal: ''
  });

  const [teamForm, setTeamForm] = useState({
    nome: '',
    nacionalidade: '',
    usuario: '',
    sitePessoal: ''
  });

  const handleDriverFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDriverForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeamFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeamForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Mapear os dados do formulário para a interface Driver
      const driverData: Omit<Driver, 'driverid'> = {
        driverref: driverForm.usuario,
        number: parseInt(driverForm.numeroCarro) || 0,
        code: driverForm.codigoPiloto,
        forename: driverForm.nome,
        surname: driverForm.sobrenome,
        dob: driverForm.dataNascimento,
        nationality: driverForm.nacionalidade,
        url: driverForm.sitePessoal
      };

      await createDriver(driverData);
      
      setSubmitMessage({ type: 'success', text: 'Piloto cadastrado com sucesso!' });
      
      // Limpar o formulário
      setDriverForm({
        nome: '',
        sobrenome: '',
        numeroCarro: '',
        nacionalidade: '',
        dataNascimento: '',
        usuario: '',
        codigoPiloto: '',
        sitePessoal: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar piloto:', error);
      setSubmitMessage({ type: 'error', text: 'Erro ao cadastrar piloto. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Mapear os dados do formulário para a interface Constructor
      const constructorData: Omit<Constructor, 'constructorid'> = {
        constructorref: teamForm.usuario,
        name: teamForm.nome,
        nationality: teamForm.nacionalidade,
        url: teamForm.sitePessoal
      };

      await createConstructor(constructorData);
      
      setSubmitMessage({ type: 'success', text: 'Escuderia cadastrada com sucesso!' });
      
      // Limpar o formulário
      setTeamForm({
        nome: '',
        nacionalidade: '',
        usuario: '',
        sitePessoal: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar escuderia:', error);
      setSubmitMessage({ type: 'error', text: 'Erro ao cadastrar escuderia. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="records-content">
        <h1>Cadastro</h1>

        <div className="records-section">
          <h2>Cadastrar</h2>
          
          {submitMessage && (
            <div className={`submit-message ${submitMessage.type}`}>
              {submitMessage.text}
            </div>
          )}
          
          <div className="records-tabs">
            <div 
              className={`tab ${activeTab === 'driver' ? 'active' : ''}`}
              onClick={() => setActiveTab('driver')}
            >
              <div className="icon driver-icon">
                <span>👤</span>
              </div>
              <span>Piloto</span>
            </div>
            
            <div 
              className={`tab ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              <div className="icon team-icon">
                <span>🏎️</span>
              </div>
              <span>Escudeira</span>
            </div>
          </div>

          {activeTab === 'driver' && (
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
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Sobrenome</label>
                    <input 
                      type="text" 
                      name="sobrenome"
                      value={driverForm.sobrenome}
                      onChange={handleDriverFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row three-columns">
                  <div className="form-group">
                    <label>Número do carro</label>
                    <input 
                      type="number" 
                      name="numeroCarro"
                      value={driverForm.numeroCarro}
                      onChange={handleDriverFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nacionalidade</label>
                    <input 
                      type="text" 
                      name="nacionalidade"
                      value={driverForm.nacionalidade}
                      onChange={handleDriverFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Data de nascimento</label>
                    <input 
                      type="date" 
                      name="dataNascimento"
                      value={driverForm.dataNascimento}
                      onChange={handleDriverFormChange}
                      required
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
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Código do piloto</label>
                    <input 
                      type="text" 
                      name="codigoPiloto"
                      value={driverForm.codigoPiloto}
                      onChange={handleDriverFormChange}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Site pessoal</label>
                    <input 
                      type="url" 
                      name="sitePessoal"
                      value={driverForm.sitePessoal}
                      onChange={handleDriverFormChange}
                      placeholder="https://exemplo.com"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar piloto'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'team' && (
            <div className="form-container">
              <h3>Dados da Escuderia</h3>
              
              <form onSubmit={handleTeamSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome</label>
                    <input 
                      type="text" 
                      name="nome"
                      value={teamForm.nome}
                      onChange={handleTeamFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nacionalidade</label>
                    <input 
                      type="text" 
                      name="nacionalidade"
                      value={teamForm.nacionalidade}
                      onChange={handleTeamFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Usuário</label>
                    <input 
                      type="text" 
                      name="usuario"
                      value={teamForm.usuario}
                      onChange={handleTeamFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Site pessoal</label>
                    <input 
                      type="url" 
                      name="sitePessoal"
                      value={teamForm.sitePessoal}
                      onChange={handleTeamFormChange}
                      placeholder="https://exemplo.com"
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar escuderia'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar is implemented in App.tsx */}
    </>
  );
};

export default Records; 