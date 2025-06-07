-- =============================================
-- RELATÓRIOS PARA ADMINISTRADOR
-- =============================================

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

CREATE INDEX idx_airports_city_type_country ON Airports(city, type, isocountry);

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
  WHERE c.name ILIKE cidade_nome
    AND haversine(c.lat, c.long, a.latdeg, a.longdeg) <= 100;
END;
$$ LANGUAGE plpgsql;

-- SELECT * FROM fn_admin_aeroportos_proximos('São Paulo');

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

-- SELECT * FROM vw_admin_corridas_por_circuito

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

-- SELECT * FROM vw_admin_corridas_detalhadas