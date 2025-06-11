-- =============================================
-- Querys - Ações de usuário 
-- =============================================

-- Função 1: verifica se há algum piloto com o forename que ja tenha corrido pela Escuderia logada
CREATE OR REPLACE FUNCTION get_drivers_by_forename_and_constructor(
  search_forename TEXT,
  constructor_id_input INTEGER
)
RETURNS TABLE (
  full_name TEXT,
  dob DATE,
  nationality TEXT
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.forename || ' ' || d.surname AS full_name,
    d.dob,
    d.nationality
  FROM driver d
  WHERE d.forename ILIKE '%' || search_forename || '%'
    AND EXISTS (
      SELECT 1
      FROM results res
      WHERE res.driverId = d.driverId
        AND res.constructorId = constructor_id_input
    );
END;
$$ LANGUAGE plpgsql;


-- Função 2: Verifica a escuderia atual do piloto recebendo seu ID
CREATE OR REPLACE FUNCTION get_driver_constructor(p_driver_id INT)
RETURNS TABLE (
  constructor_id INT,
  constructor_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.constructorId,
    c.name
  FROM results res
  JOIN constructors c ON res.constructorId = c.constructorId
  WHERE res.driverId = p_driver_id
  ORDER BY res.raceId DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
