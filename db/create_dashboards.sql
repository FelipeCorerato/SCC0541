-- =============================================
-- FUNÇÕES PARA DASHBOARDS DE ADMINISTRADOR 
-- =============================================

-- FUNÇÃO 1: Resumo geral para administrador
-- Retorna o total de pilotos (drivers), escuderias (constructors) e temporadas (seasons) cadastradas no banco.
CREATE FUNCTION get_admin_summary()
RETURNS TABLE (
    total_driver bigint,
    total_constructors bigint,
    total_seasons bigint
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM driver),       
    (SELECT COUNT(*) FROM constructors), 
    (SELECT COUNT(*) FROM seasons);      
END;
$$ LANGUAGE plpgsql;


-- FUNÇÃO 2: Listagem de corridas do ano de 2024
-- Retorna as corridas realizadas em 2024 com informações de id, nome, data, total de voltas e tempo total.
CREATE FUNCTION get_races_2024()
RETURNS TABLE (
    race_id INTEGER,
    race_name TEXT,
    race_date DATE,
    total_laps BIGINT,
    total_time BIGINT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.raceId,
    r.name,
    r.date,
    COALESCE(SUM(res.laps), 0),         -- Soma das voltas completadas na corrida
    COALESCE(SUM(res.milliseconds), 0)  -- Soma do tempo total em milissegundos dos resultados
  FROM races r
  LEFT JOIN results res ON r.raceId = res.raceId
  WHERE r.year = 2024
  GROUP BY r.raceId, r.name, r.date;
END;
$$ LANGUAGE plpgsql;


-- FUNÇÃO 3: Pontuação das escuderias em 2024
-- Retorna a lista das escuderias com a soma total dos pontos obtidos nas corridas do ano de 2024, ordenada do maior para o menor total.
CREATE OR REPLACE FUNCTION get_constructors_2024()
RETURNS TABLE (
  constructor_id INTEGER,
  constructor_name TEXT,
  total_pontos DOUBLE PRECISION
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.constructorId,
    c.name,
    SUM(res.points)::DOUBLE PRECISION   -- Soma dos pontos obtidos pela escuderia nas corridas de 2024
  FROM results res
  JOIN constructors c ON res.constructorId = c.constructorId
  JOIN races r ON res.raceId = r.raceId
  WHERE r.year = 2024
  GROUP BY c.constructorId, c.name
  ORDER BY total_pontos DESC;
END;
$$ LANGUAGE plpgsql;


-- FUNÇÃO 4: Pontuação dos pilotos em 2024
-- Retorna a lista dos pilotos com a soma total dos pontos obtidos nas corridas do ano de 2024, ordenada do maior para o menor total.
CREATE OR REPLACE FUNCTION get_drivers_2024()
RETURNS TABLE (
  driver_id INTEGER,
  driver_name TEXT,
  total_pontos DOUBLE PRECISION
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.driverId,
    d.forename || ' ' || d.surname,      
    SUM(res.points)::DOUBLE PRECISION        -- Soma dos pontos do piloto nas corridas de 2024
  FROM results res
  JOIN driver d ON res.driverId = d.driverId
  JOIN races r ON res.raceId = r.raceId
  WHERE r.year = 2024
  GROUP BY d.driverId, d.forename, d.surname
  ORDER BY total_pontos DESC;
END;
$$ LANGUAGE plpgsql;


-- =============================================
-- FUNÇÕES PARA DASHBOARDS DA ESCUDERIA 
-- =============================================

-- FUNÇÃO 1: Quantidade de vitórias da escuderia
-- Recebe o ID da escuderia e retorna a quantidade total de vitórias (posição 1) dessa escuderia nas corridas.
CREATE OR REPLACE FUNCTION fn_escuderia_total_vitorias(constr_id INT)
RETURNS BIGINT AS $$
DECLARE
  total_vitorias BIGINT;
BEGIN
  SELECT COUNT(*)
  INTO total_vitorias
  FROM results
  WHERE constructorId = constr_id
    AND positionOrder = 1;  -- vitórias correspondem à posição 1
  
  RETURN total_vitorias;
END;
$$ LANGUAGE plpgsql;


-- FUNÇÃO 2: Quantidade de pilotos diferentes que correram pela escuderia
-- Recebe o ID da escuderia e retorna a contagem distinta de pilotos que já participaram correndo pela escuderia.
CREATE OR REPLACE FUNCTION fn_escuderia_total_pilotos(constr_id INT)
RETURNS BIGINT AS $$
DECLARE
  total_pilotos BIGINT;
BEGIN
  SELECT COUNT(DISTINCT driverId)
  INTO total_pilotos
  FROM results
  WHERE constructorId = constr_id;
  
  RETURN total_pilotos;
END;
$$ LANGUAGE plpgsql;


-- FUNÇÃO 3: Primeiro e último ano com dados da escuderia
-- Recebe o ID da escuderia e retorna o menor e maior ano que existem registros da escuderia na tabela results (via corrida).
CREATE OR REPLACE FUNCTION fn_escuderia_anos_atividade(constr_id INT)
RETURNS TABLE (
  primeiro_ano INT,
  ultimo_ano INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    MIN(r.year) AS primeiro_ano,
    MAX(r.year) AS ultimo_ano
  FROM results res
  JOIN races r ON res.raceId = r.raceId
  WHERE res.constructorId = constr_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- FUNÇÕES PARA DASHBOARDS DE PILOTO
-- =============================================

-- FUNÇÃO 1: Primeiro e último ano com dados do piloto
-- Recebe o ID do piloto e retorna o menor e maior ano que existem registros do piloto na tabela results (via corrida).
CREATE OR REPLACE FUNCTION fn_piloto_anos_atividade(driver_id INT)
RETURNS TABLE (
  primeiro_ano INT,
  ultimo_ano INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    MIN(r.year) AS primeiro_ano,
    MAX(r.year) AS ultimo_ano
  FROM results res
  JOIN races r ON res.raceId = r.raceId
  WHERE res.driverId = driver_id;
END;
$$ LANGUAGE plpgsql;


-- FUNÇÃO 2: Estatísticas do piloto por ano e circuito
-- Para cada ano e circuito em que o piloto participou, retorna a soma de pontos, quantidade de vitórias e total de corridas.
CREATE OR REPLACE FUNCTION fn_piloto_estatisticas_ano_circuito(driver_id INT)
RETURNS TABLE (
  ano INT,
  circuito_id INT,
  circuito_nome TEXT,
  total_pontos DOUBLE PRECISION,
  total_vitorias BIGINT,
  total_corridas BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.year AS ano,
    r.circuitId AS circuito_id,
    c.name AS circuito_nome,
    COALESCE(SUM(res.points)::double precision, 0) AS total_pontos, 
    COUNT(CASE WHEN res.positionOrder = 1 THEN 1 END) AS total_vitorias,
    COUNT(DISTINCT res.raceId) AS total_corridas
  FROM results res
  JOIN races r ON res.raceId = r.raceId
  JOIN circuits c ON r.circuitId = c.circuitId
  WHERE res.driverId = driver_id
  GROUP BY r.year, r.circuitId, c.name
  ORDER BY r.year, c.name;
END;
$$ LANGUAGE plpgsql;


