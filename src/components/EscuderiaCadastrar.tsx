import React, { useState, useRef } from 'react';
import '../styles/EscuderiaConsultar.css';
import { uploadDriversCSV } from '../services/drivers';
import { showSuccess, showError } from '../utils/toast';

const EscuderiaCadastrar: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setUploadSuccess(false);
      setUploadMessage('');
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadMessage('');
    
    try {
      setUploadMessage('Processando arquivo CSV...');
      await uploadDriversCSV(selectedFile);
      setUploadSuccess(true);
      setUploadMessage(`Arquivo "${selectedFile.name}" processado com sucesso! Pilotos cadastrados.`);
      showSuccess('Pilotos cadastrados com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      setUploadSuccess(false);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setUploadMessage(`Erro ao processar o arquivo: ${errorMessage}`);
      showError('Erro ao processar arquivo CSV');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFileName('');
    setUploadSuccess(false);
    setUploadMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="escuderia-consultar">
      <h1>Cadastrar</h1>

      <div className="search-section-container">
        <div className="search-section">
          <h2>Cadastrar pilotos por arquivo (1 piloto por linha)</h2>
          <p className="search-description">
            Faça upload de um arquivo CSV com os dados dos pilotos.
          </p>
          <div className="csv-instructions">
            <p><strong>Formato do arquivo:</strong></p>
            <ul>
              <li><strong>Colunas obrigatórias:</strong> forename, surname</li>
              <li><strong>Colunas opcionais:</strong> number, code, dob (formato: YYYY-MM-DD), nationality, url</li>
            </ul>
            <p><strong>Exemplo:</strong></p>
            <code className="csv-example">
              forename,surname,number,code,dob,nationality,url<br/>
              Lewis,Hamilton,44,HAM,1985-01-07,British,https://lewishamilton.com
            </code>
          </div>

          <div className="file-upload-container">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleFileSelect}
              className="file-input-hidden"
            />
            <input
              type="text"
              placeholder="Buscar arquivo"
              value={fileName}
              onClick={handleBrowseClick}
              readOnly
              className="search-input file-clickable-input"
            />
            <button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="search-button upload-button"
            >
              {isUploading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>

          {uploadMessage && (
            <div className={`upload-message ${uploadSuccess ? 'success' : 'error'}`}>
              <p>{uploadMessage}</p>
            </div>
          )}

          {uploadSuccess && (
            <div className="upload-success">
              <div className="success-icon">✅</div>
              <p>Arquivo "{fileName}" enviado com sucesso!</p>
              <button onClick={resetForm} className="reset-button">
                Enviar outro arquivo
              </button>
            </div>
          )}

          {!selectedFile && !uploadSuccess && (
            <div className="upload-instructions">
              <div className="instruction-icon">📄</div>
              <p>Selecione um arquivo CSV com os dados dos pilotos</p>
              <small>Formatos aceitos: .csv, .txt</small>
            </div>
          )}
        </div>
      </div>

      {selectedFile && !uploadSuccess && (
        <div className="file-preview-container">
          <div className="file-preview">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3>Arquivo selecionado:</h3>
              <button 
                onClick={resetForm}
                disabled={isUploading}
                className="search-button clear-button"
                style={{ backgroundColor: '#dc3545', padding: '5px 10px', fontSize: '14px' }}
              >
                Limpar
              </button>
            </div>
            <div className="file-info">
              <div className="file-icon">📄</div>
              <div className="file-details">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscuderiaCadastrar; 