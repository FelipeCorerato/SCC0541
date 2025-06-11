-- =============================================
-- RELATÓRIOS PARA ADMINISTRADOR
-- =============================================

-- Habilitar extensão para remover acentos
CREATE EXTENSION IF NOT EXISTS unaccent;

-- RELATÓRIO 1: Contagem de resultados por status
CREATE OR REPLACE VIEW vw_admin_resultados_por_status AS
SELECT 
  s.status,
  COUNT(*) AS total
FROM Results r
JOIN Status s ON r.statusid = s.statusid
GROUP BY s.status
ORDER BY total DESC;

-- SELECT * FROM vw_admin_resultados_por_status;

-- RELATÓRIO 2: Aeroportos até 100km de cidades com mesmo nome

-- Função para calcular distância Haversine (em km)
CREATE OR REPLACE FUNCTION haversine(lat1 DOUBLE PRECISION, lon1 DOUBLE PRECISION, lat2 DOUBLE PRECISION, lon2 DOUBLE PRECISION)
RETURNS DOUBLE PRECISION AS $$
DECLARE
    r INTEGER := 6371; -- raio da Terra em km
    dlat DOUBLE PRECISION := radians(lat2 - lat1);
    dlon DOUBLE PRECISION := radians(lon2 - lon1);
    a DOUBLE PRECISION := sin(dlat/2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)^2;
BEGIN
    RETURN 2 * r * atan2(sqrt(a), sqrt(1 - a));
END;
$$ LANGUAGE plpgsql;

-- Função para buscar aeroportos próximos
CREATE OR REPLACE FUNCTION fn_admin_aeroportos_proximos(cidade_nome TEXT)
RETURNS TABLE(
    nome_cidade TEXT,
    codigo_iata TEXT,
    nome_aeroporto TEXT,
    cidade_aeroporto TEXT,
    distancia_km DOUBLE PRECISION,
    tipo TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.name::TEXT,
    a.iatacode::TEXT,
    a.name::TEXT,
    a.city::TEXT,
    haversine(c.lat, c.long, a.latdeg, a.longdeg) AS distancia_km,
    a.type::TEXT
  FROM geocities15k c
  JOIN Airports a ON a.isocountry = 'BR' AND a.type IN ('medium_airport', 'large_airport')
  WHERE (
    c.name ILIKE '%' || cidade_nome || '%' OR
    unaccent(c.name) ILIKE '%' || unaccent(cidade_nome) || '%'
  )
    AND haversine(c.lat, c.long, a.latdeg, a.longdeg) <= 100
  ORDER BY distancia_km ASC; -- Ordenar do mais próximo para o mais distante
END;
$$ LANGUAGE plpgsql;

-- SELECT * FROM fn_admin_aeroportos_proximos('São Paulo');

-- Função para buscar cidades para autocomplete
CREATE OR REPLACE FUNCTION fn_buscar_cidades_autocomplete(busca TEXT)
RETURNS TABLE(
    nome_cidade TEXT,
    pais TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    c.name::TEXT,
    c.country::TEXT
  FROM geocities15k c
  WHERE (
    c.name ILIKE '%' || busca || '%' OR
    unaccent(c.name) ILIKE '%' || unaccent(busca) || '%'
  )
    AND c.country = 'BR' -- Filtrar apenas cidades brasileiras
  ORDER BY c.name
  LIMIT 10; -- Limitar a 10 sugestões
END;
$$ LANGUAGE plpgsql;

-- SELECT * FROM fn_buscar_cidades_autocomplete('São');

-- RELATÓRIO 3.1: Total de corridas cadastradas
CREATE OR REPLACE VIEW vw_admin_total_corridas AS
SELECT COUNT(*) AS total_corridas FROM Races;

-- SELECT * FROM vw_admin_total_corridas;

-- RELATÓRIO 3.2: Corridas por circuito com estatísticas de voltas
CREATE OR REPLACE VIEW vw_admin_corridas_por_circuito AS
SELECT 
  r.circuitid,
  c.name AS circuito,
  COUNT(DISTINCT r.raceid) AS qtd_corridas,
  MIN(res.laps) AS min_voltas,
  MAX(res.laps) AS max_voltas,
  ROUND(AVG(res.laps)::NUMERIC, 2) AS media_voltas
FROM races r
JOIN circuits c ON c.circuitid = r.circuitid
JOIN results res ON res.raceid = r.raceid
GROUP BY r.circuitid, c.name;

-- SELECT * FROM vw_admin_corridas_por_circuito;

-- RELATÓRIO 3.3: Detalhamento por corrida
CREATE OR REPLACE VIEW vw_admin_corridas_detalhadas AS
SELECT 
  r.circuitId,
  r.raceId,
  r.name AS corrida,
  res.laps,
  r.date,
  r.time
FROM Races r
JOIN results res ON res.raceid = r.raceid;

-- SELECT * FROM vw_admin_corridas_detalhadas;

-- =============================================
-- RELATÓRIOS PARA ESCUDERIA
-- =============================================

-- RELATÓRIO 4: Pilotos com vitórias
CREATE OR REPLACE FUNCTION fn_escuderia_pilotos_vitorias(constr_id INT)
RETURNS TABLE (
    piloto TEXT,
    vitorias BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.forename || ' ' || d.surname AS piloto,
    COUNT(*) AS vitorias
  FROM Results r
  JOIN Driver d ON d.driverId = r.driverId
  WHERE r.constructorId = constr_id AND r.positionOrder = 1
  GROUP BY d.forename, d.surname
  ORDER BY vitorias DESC;
END;
$$ LANGUAGE plpgsql;

-- SELECT * FROM fn_escuderia_pilotos_vitorias(1);

-- RELATÓRIO 5: Resultados por status (escuderia)
CREATE OR REPLACE FUNCTION fn_escuderia_resultados_por_status(constr_id INT)
RETURNS TABLE (
    status TEXT,
    total BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.status, COUNT(*) as total
  FROM Results r
  JOIN Status s ON s.statusid = r.statusid
  WHERE constructorId = constr_id
  GROUP BY s.status
  ORDER BY total desc;
END;
$$ LANGUAGE plpgsql;

-- SELECT * FROM fn_escuderia_resultados_por_status(2);

-- =============================================
-- RELATÓRIOS PARA PILOTO
-- =============================================

-- RELATÓRIO 6: Pontos por ano, por corrida
CREATE OR REPLACE FUNCTION fn_piloto_pontos_por_ano(driver_id INT)
RETURNS TABLE (
    ano INT,
    corrida TEXT,
    pontos DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ra.year,
    ra.name,
    re.points
  FROM Results re
  JOIN Races ra ON ra.raceId = re.raceId
  WHERE re.driverId = driver_id
  ORDER BY ra.year, ra.date;
END;
$$ LANGUAGE plpgsql;

-- SELECT * FROM fn_piloto_pontos_por_ano(3);

-- RELATÓRIO 7: Status dos resultados do piloto
CREATE OR REPLACE FUNCTION fn_piloto_resultados_por_status(driver_id INT)
RETURNS TABLE (
    status TEXT,
    total BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.status, COUNT(*)
  FROM Results r
  JOIN Status s ON s.statusid = r.statusid
  WHERE driverId = driver_id
  GROUP BY s.status
  ORDER BY total DESC;
END;
$$ LANGUAGE plpgsql;

-- SELECT * FROM fn_piloto_resultados_por_status(3);

-- =============================================
-- ÍNDICES CRIADOS
-- =============================================

CREATE INDEX idx_results_race ON Results(raceId);
CREATE INDEX idx_races_year ON Races(year);
CREATE INDEX idx_airports_location ON Airports(latdeg, longdeg);
CREATE INDEX idx_results_driver_points_race ON Results (driverId, points, raceId);
CREATE INDEX idx_results_constructor_position_driver ON Results (constructorId, positionOrder, driverId);