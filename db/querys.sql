-- =============================================
-- Query - Ação de usuário 
-- =============================================

-- função 1: e verifica se há algum piloto com esse forename que ja tenha corrido pela Escuderia logada
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
  WHERE d.forename ILIKE search_forename
    AND EXISTS (
      SELECT 1
      FROM results res
      WHERE res.driverId = d.driverId
        AND res.constructorId = constructor_id_input
    );
END;
$$ LANGUAGE plpgsql;
