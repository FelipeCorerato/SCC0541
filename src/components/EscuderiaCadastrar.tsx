import React, { useState, useRef } from 'react';
import '../styles/EscuderiaConsultar.css';

const EscuderiaCadastrar: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setUploadSuccess(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    // Simula upload do arquivo
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      console.log('Arquivo enviado:', selectedFile.name);
    }, 2000);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFileName('');
    setUploadSuccess(false);
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
            Faça upload de um arquivo CSV com os dados dos pilotos
          </p>

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
              <small>Formato aceito: .csv, .txt</small>
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