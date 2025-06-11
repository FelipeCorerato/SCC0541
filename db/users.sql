/* 
    - Cria as funções de encriptação e verificação de senha;
    - Define a tabela USERS com os índices necessários;
    - Faz o ingest inicial de users com os dados originais (constructors, drivers e admin);
    - Cria as funções de atualização e inserção automática de novos users;
    - Cria os triggers das funções;
    - Cria a tabela Users_Logs;
    - Cria a função de login (recebe credenciais, verifica, retorna o resultado)
*/

--=======================================================================================================

-- Habilita a extensão pgcrypto, necessária para gerar hashes com segurança
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para gerar hash no formato SCRAM-SHA-256 com salt aleatório
CREATE OR REPLACE FUNCTION generate_scram_hash(Password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN 'SCRAM-SHA-256$4096:' || encode(gen_random_bytes(16), 'base64') || '$' || 
           encode(digest(Password, 'sha256'), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se a senha informada gera o mesmo hash armazenado
CREATE OR REPLACE FUNCTION verify_scram_hash(Password TEXT, Password_Hash TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    salt TEXT;
    stored_hash TEXT;
    computed_hash TEXT;
BEGIN
    -- Extrai o salt do hash salvo
    salt := split_part(split_part(Password_Hash, '$', 2), ':', 2);
    
    -- Recalcula o hash usando o mesmo salt
    computed_hash := 'SCRAM-SHA-256$4096:' || salt || '$' || encode(digest(Password, 'sha256'), 'base64');
    
    -- Retorna true se os hashes coincidirem
    RETURN computed_hash = Password_Hash;
END;
$$ LANGUAGE plpgsql; 

--=======================================================================================================

-- Cria a tabela de usuários com campos obrigatórios
DROP TABLE IF EXISTS USERS CASCADE;
CREATE TABLE USERS (
	UserId SERIAL, -- identificador único
	Login TEXT NOT NULL UNIQUE, -- login único
	Password TEXT NOT NULL, -- senha (hash)
	Tipo VARCHAR(15) NOT NULL, -- tipo de usuário
	IdOriginal INTEGER NOT NULL, -- referência ao ID da origem (Piloto, Escuderia etc.)
	CONSTRAINT PK_USERS PRIMARY KEY (UserId),
	CONSTRAINT TIPO_CHECK CHECK(Tipo in ('Administrador', 'Escuderia', 'Piloto')) -- validação do tipo
);

-- Índices para melhorar consultas por tipo e por origem
CREATE INDEX idx_users_tipo ON Users(Tipo);
CREATE INDEX idx_users_idoriginal ON Users(IdOriginal);

--=======================================================================================================

-- Insere escuderias da tabela Constructors como usuários
INSERT INTO Users (Login, Password, Tipo, IdOriginal)
SELECT 
	LOWER(ConstructorRef) || '_c', -- cria login padronizado
	generate_scram_hash(ConstructorRef), -- gera senha usando o nome como base
	'Escuderia',
	ConstructorId
FROM Constructors;

-- Função que mantém a sincronização de escuderias com a tabela Users via trigger
CREATE OR REPLACE FUNCTION Sync_Constructor_Users()
RETURNS TRIGGER AS $$
BEGIN
  -- Evita duplicidade de login
  IF TG_OP = 'INSERT' AND EXISTS (SELECT 1 FROM Users WHERE Login = LOWER(NEW.ConstructorRef) || '_c') THEN
    RAISE EXCEPTION 'Login já existe';
    RETURN NULL;
  END IF;

  -- Em caso de inserção, adiciona o usuário correspondente
  IF TG_OP = 'INSERT' THEN
    INSERT INTO Users (Login, Password, Tipo, IdOriginal)
    VALUES (LOWER(NEW.ConstructorRef) || '_c', generate_scram_hash(NEW.ConstructorRef), 'Escuderia', NEW.ConstructorId);
    
  -- Em caso de atualização, atualiza os dados do usuário correspondente
  ELSIF TG_OP = 'UPDATE' THEN
    IF EXISTS (SELECT 1 FROM Users 
               WHERE Login = LOWER(NEW.ConstructorRef) || '_c' 
               AND IdOriginal != OLD.ConstructorId) THEN
      RAISE EXCEPTION 'Login já existe';
      RETURN NULL;
    END IF;
	
    UPDATE Users
    SET
      Login = LOWER(NEW.ConstructorRef) || '_c',
      Password = generate_scram_hash(NEW.ConstructorRef),
      Tipo = 'Escuderia',
      IdOriginal = NEW.ConstructorId
    WHERE IdOriginal = OLD.ConstructorId AND Tipo = 'Escuderia';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria trigger que executa a função após insert ou update na tabela Constructors
DROP TRIGGER IF EXISTS trg_sync_users_constructors ON Constructors;
CREATE TRIGGER trg_sync_users_constructors
AFTER INSERT OR UPDATE ON Constructors
FOR EACH ROW
EXECUTE FUNCTION Sync_Constructor_Users();

--=======================================================================================================

-- Insere pilotos da tabela Driver como usuários
INSERT INTO Users (Login, Password, Tipo, IdOriginal)
SELECT 
	LOWER(DriverRef) || '_d', -- cria login padronizado
	generate_scram_hash(DriverRef), -- senha usando o nome como base
	'Piloto',
	DriverId
FROM Driver;

-- Função que mantém a sincronização de pilotos com a tabela Users via trigger
CREATE OR REPLACE FUNCTION Sync_Driver_Users()
RETURNS TRIGGER AS $$
BEGIN
  -- Evita duplicidade de login
  IF TG_OP = 'INSERT' AND EXISTS (SELECT 1 FROM Users WHERE Login = LOWER(NEW.DriverRef) || '_d') THEN
    RAISE EXCEPTION 'Login já existe';
    RETURN NULL;
  END IF;
  
  -- Em caso de inserção, adiciona o usuário correspondente
  IF TG_OP = 'INSERT' THEN
    INSERT INTO Users (Login, Password, Tipo, IdOriginal)
    VALUES (LOWER(NEW.DriverRef) || '_d', generate_scram_hash(NEW.DriverRef), 'Piloto', NEW.DriverId);
    
  -- Em caso de atualização, atualiza os dados do usuário correspondente
  ELSIF TG_OP = 'UPDATE' THEN
    IF EXISTS (SELECT 1 FROM Users 
               WHERE Login = LOWER(NEW.DriverRef) || '_d' 
               AND IdOriginal != OLD.DriverId) THEN
      RAISE EXCEPTION 'Login já existe';
      RETURN NULL;
    END IF;
	
    UPDATE Users
    SET
      Login = LOWER(NEW.DriverRef) || '_d',
      Password = generate_scram_hash(NEW.DriverRef),
      Tipo = 'Piloto',
      IdOriginal = NEW.DriverId
    WHERE IdOriginal = OLD.DriverId AND Tipo = 'Piloto';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria trigger que executa a função após insert ou update na tabela Driver
DROP TRIGGER IF EXISTS trg_sync_users_drivers ON Driver;
CREATE TRIGGER trg_sync_users_drivers
AFTER INSERT OR UPDATE ON Driver
FOR EACH ROW
EXECUTE FUNCTION Sync_Driver_Users();

--=======================================================================================================

-- Insere manualmente um usuário administrador
INSERT INTO Users (Login, Password, Tipo, IdOriginal)
VALUES (
	'admin',
	generate_scram_hash('admin'), -- a senha "admin" será salva com hash
	'Administrador',
	0
);

--=======================================================================================================

-- Cria tabela para registrar ações de login e logout dos usuários
DROP TABLE IF EXISTS Users_Log CASCADE;
CREATE TABLE Users_Log (
	UserId INTEGER, -- referência ao usuário
	DataHora TIMESTAMP, -- data e hora da ação
	Acao TEXT, -- tipo da ação ('login' ou 'logout')
	CONSTRAINT acao_log_check CHECK(Acao in ('login', 'logout')),
	CONSTRAINT PK_UsersLog PRIMARY KEY (UserId, DataHora)
);

-- Índice para otimizar buscas por data e hora
CREATE INDEX idx_users_log ON Users_Log(DataHora);

-- Função que insere um novo registro de log na tabela Users_Log
CREATE OR REPLACE FUNCTION fn_create_users_log(
    u_id INTEGER,
    u_acao TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO Users_Log (userid, datahora, acao)
    VALUES (
        u_id,
        CURRENT_TIMESTAMP,
        u_acao
    );
END;
$$ LANGUAGE plpgsql;

--=======================================================================================================

-- Função de login que valida usuário e registra o acesso no log
CREATE OR REPLACE FUNCTION fn_user_login(p_login TEXT, p_password TEXT)
RETURNS TABLE (
    UserId INTEGER,
    Login TEXT,
    Tipo VARCHAR,
    IdOriginal INTEGER
) AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Busca o usuário pelo login
    SELECT * INTO user_record
    FROM Users u
    WHERE u.Login = p_login;

    -- Se o login não for encontrado, retorna vazio
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Verifica se a senha está correta
    IF verify_scram_hash(p_password, user_record.Password) THEN
        -- Registra o login na tabela de log
        PERFORM fn_create_users_log(user_record.UserId, 'login');

        -- Retorna os dados do usuário autenticado
        RETURN QUERY
        SELECT user_record.UserId, user_record.Login, user_record.Tipo, user_record.IdOriginal;
    END IF;

    -- Se a senha estiver incorreta, retorna vazio
    RETURN;
END;
$$ LANGUAGE plpgsql;
