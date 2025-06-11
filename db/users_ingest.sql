
/* 
    - Define a tabela USERS com os índices necessários;
    - Faz o ingest inicial de users (constructors, drivers e admin);
    - Cria as funções de atualização e inserção automática de novos users;
    - Cria os triggers das funções;
    - Cria a tabela Users_Logs
*/

--=======================================================================================================

DROP TABLE IF EXISTS USERS CASCADE;
CREATE TABLE USERS (
	UserId SERIAL,
	Login TEXT NOT NULL UNIQUE,
	Password TEXT NOT NULL,
	Tipo VARCHAR(15) NOT NULL,
	IdOriginal INTEGER NOT NULL,
	CONSTRAINT PK_USERS PRIMARY KEY (UserId),
	CONSTRAINT TIPO_CHECK CHECK(Tipo in ('Administrador', 'Escuderia', 'Piloto'))
);

CREATE INDEX idx_users_tipo ON Users(Tipo);
CREATE INDEX idx_users_idoriginal ON Users(IdOriginal);

-- Inserir dados da tabela Constructors para users
INSERT INTO Users (Login, Password, Tipo, IdOriginal)
SELECT 
	LOWER(ConstructorRef) || '_c',
	ConstructorRef,
	'Escuderia',
	ConstructorId
FROM Constructors;

CREATE OR REPLACE FUNCTION Sync_Constructor_Users()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND EXISTS (SELECT 1 FROM Users WHERE Login = LOWER(NEW.ConstructorRef) || '_c') THEN
    RAISE EXCEPTION 'Login já existe';
    RETURN NULL; -- Cancela a inserção
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO Users (Login, Password, Tipo, IdOriginal)
    VALUES (LOWER(NEW.ConstructorRef) || '_c', NEW.ConstructorRef, 'Escuderia', NEW.ConstructorId);
    
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
      Password = NEW.ConstructorRef,
      Tipo = 'Escuderia',
      IdOriginal = NEW.ConstructorId
    WHERE IdOriginal = OLD.ConstructorId AND Tipo = 'Escuderia';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_constructor_sync ON Constructors;
CREATE TRIGGER trg_constructor_sync
AFTER INSERT OR UPDATE ON Constructors
FOR EACH ROW
EXECUTE FUNCTION Sync_Constructor_Users();


--=======================================================================================================

-- Inserir dados da tabela Driver para users
INSERT INTO Users (Login, Password, Tipo, IdOriginal)
SELECT 
	LOWER(DriverRef) || '_d',
	DriverRef,
	'Piloto',
	DriverId
FROM Driver;

CREATE OR REPLACE FUNCTION Sync_Driver_Users()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND EXISTS (SELECT 1 FROM Users WHERE Login = LOWER(NEW.DriverRef) || '_d') THEN
    RAISE EXCEPTION 'Login já existe';
    RETURN NULL; -- Cancela a inserção
  END IF;
  
  IF TG_OP = 'INSERT' THEN
    INSERT INTO Users (Login, Password, Tipo, IdOriginal)
    VALUES (LOWER(NEW.DriverRef) || '_d', NEW.DriverRef, 'Piloto', NEW.DriverId);
    
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
      Password = NEW.DriverRef,
      Tipo = 'Piloto',
      IdOriginal = NEW.DriverId
    WHERE IdOriginal = OLD.DriverId AND Tipo = 'Piloto';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_driver_sync ON Driver;
CREATE TRIGGER trg_driver_sync
AFTER INSERT OR UPDATE ON Driver
FOR EACH ROW
EXECUTE FUNCTION Sync_Driver_Users();

--=======================================================================================================

INSERT INTO Users (Login, Password, Tipo, IdOriginal)
VALUES (
	'admin',
	'admin',
	'Administrador',
	0
);

--=======================================================================================================

DROP TABLE IF EXISTS Users_Log CASCADE;
CREATE TABLE Users_Log (
	UserId INTEGER,
  DataHora TIMESTAMP,
  Acao TEXT,
  CONSTRAINT acao_log_check CHECK(Acao in ('login', 'logout')),
	CONSTRAINT PK_UsersLog PRIMARY KEY (UserId, DataHora)
);

CREATE INDEX idx_users_log ON Users_Log(DataHora);

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
