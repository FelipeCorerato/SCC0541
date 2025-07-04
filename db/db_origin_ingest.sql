/*
  - Cria as tabelas do db original de F1;
  - Realiza o ingest segundo os arquivos;

  OBS: A linha 32 deve ser alterada conforme a localização real dos arquivos do ingest
*/

--==============================================================================================================

CREATE OR REPLACE FUNCTION Public.LoadFile (Diret TEXT, FN TEXT, Tab TEXT, Delimiter TEXT)
    RETURNS INT AS $$
  DECLARE
    CMD Text;   Tot INT:=0;
  BEGIN
    RAISE NOTICE 'Carregando %', Tab;
    IF FN IS NOT NULL THEN
        EXECUTE 'COPY '||Tab||' FROM '''||Diret||FN||''' WITH ('||Delimiter||')';
        -- CMD:=Substring(Tab, '(.+)\(.'); 
        -- Apaga a extensão do arquivo
        CMD:=regexp_replace(Tab, '(\....)', '');
        IF CMD IS NULL THEN CMD:=Tab; END IF;
        CMD:='SELECT COUNT(*) FROM '|| CMD;
        EXECUTE CMD INTO Tot;
        RAISE NOTICE 'Carregada Tabela %:= %', Tab, Tot;
        END IF;
    RETURN Tot;
    END;
$$  LANGUAGE plpgsql VOLATILE RETURNS NULL ON NULL INPUT;


DO $$ DECLARE DirLocal TEXT; BEGIN
	DirLocal:= '/mnt/f1/';

--==============================================================================================================
--== Define todas as tabelas ===================================================================================

--== Formula 1
DROP VIEW IF EXISTS Tables;
DROP TABLE IF EXISTS Circuits CASCADE;
CREATE TABLE Circuits (
    CircuitId INTEGER PRIMARY KEY,
    CircuitRef TEXT NOT NULL UNIQUE,
    Name TEXT NOT NULL UNIQUE,
    Location TEXT,
    Country TEXT,
    Lat FLOAT,
    Lng FLOAT,
    Alt FLOAT,
    URL TEXT
    );


DROP TABLE IF EXISTS Constructors CASCADE;
CREATE TABLE Constructors  (
    ConstructorId INTEGER PRIMARY KEY,
    ConstructorRef TEXT UNIQUE,
    Name TEXT UNIQUE,
    Nationality TEXT,
    Url TEXT
    );

DROP TABLE IF EXISTS DriverStandings CASCADE;
CREATE TABLE  DriverStandings(
    DriverStandingsId INTEGER PRIMARY KEY,
    RaceId  INTEGER,
    DriverId INTEGER,
    Points FLOAT,
    Position INTEGER,
    PositionText TEXT,
    Wins INTEGER,
    CONSTRAINT DSLogKey UNIQUE (RaceId, DriverId),
    CONSTRAINT DSPositionKey UNIQUE (RaceId, Position)
    );

DROP TABLE IF EXISTS Driver CASCADE;
CREATE TABLE Driver(
    DriverId INTEGER PRIMARY KEY,
    DriverRef TEXT UNIQUE,
    Number INTEGER,
    Code TEXT,
    Forename TEXT,
    Surname TEXT,
    Dob DATE,
    Nationality TEXT,
    URL TEXT UNIQUE,
    CONSTRAINT DrLogKey UNIQUE (Forename, Surname)
    );

DROP TABLE IF EXISTS LapTimes CASCADE;
CREATE TABLE LapTimes(
    RaceId INTEGER,
    DriverId INTEGER,
    Lap INTEGER,
    Position INTEGER,
    Time TEXT,
    Milliseconds INTEGER,
    PRIMARY KEY (RaceId, DriverId, Lap)
    );

DROP TABLE IF EXISTS PitStops CASCADE;
CREATE TABLE PitStops(
    RaceId INTEGER,
    DriverId INTEGER,
    Stop INTEGER,
    Lap INTEGER,
    Time TEXT,
    Duration TEXT,
    Milliseconds INTEGER,
    PRIMARY KEY (RaceId, DriverId, Stop)
    );

DROP TABLE IF EXISTS Qualifying CASCADE;
CREATE TABLE Qualifying(
    QualifyId INTEGER PRIMARY KEY,
    RaceId  INTEGER,
    DriverId  INTEGER,
    ConstructorId  INTEGER,
    Number  INTEGER,
    Position  INTEGER,
    Q1  TEXT,
    Q2  TEXT,
    Q3  TEXT,
    CONSTRAINT QuLogKey UNIQUE (RaceId, DriverId, ConstructorId)
    );

DROP TABLE IF EXISTS Races CASCADE;
CREATE TABLE Races(
    RaceId INTEGER PRIMARY KEY,
    YEAR INTEGER,
    Round INTEGER,
    CircuitId INTEGER,
    Name TEXT,
    Date DATE,
    Time TEXT,
    URL TEXT UNIQUE,
    Dfp1 DATE,
    Tfp1 TEXT,
    Dfp2 DATE,
    Tfp2 TEXT,
    Dfp3 DATE,
    Tfp3 TEXT,
    Dquali DATE,
    Tquali TEXT,
    Dsprint DATE,
    Tsprint TEXT
);

DROP TABLE IF EXISTS Results CASCADE;
CREATE TABLE Results(
    ResultId  INTEGER PRIMARY KEY,
    RaceId  INTEGER,
    DriverId  INTEGER,
    ConstructorId  INTEGER,
    Number INTEGER,
    Grid  INTEGER,
    Position  INTEGER,
    PositionText  TEXT,
    PositionOrder  INTEGER,
    Points  FLOAT,
    Laps  INTEGER,
    Time  TEXT,
    Milliseconds  INTEGER,
    FastestLap  INTEGER,
    Rank INTEGER,
    FastestLapTime  TEXT,
    FastestLapSpeed  TEXT,
    StatusId  INTEGER
    );

DROP TABLE IF EXISTS Seasons CASCADE;
CREATE TABLE Seasons(
    Year  INTEGER PRIMARY KEY,
    Url  TEXT
    );

DROP TABLE IF EXISTS Status CASCADE;
CREATE TABLE Status(
    StatusId  INTEGER PRIMARY KEY,
    Status  TEXT
    );

--== Airports 
DROP TABLE IF EXISTS Airports CASCADE;
CREATE TABLE Airports(
    Id INTEGER,
    Ident CHAR(8),
    Type CHAR(15),
    Name TEXT,
    LatDeg DOUBLE PRECISION,
    LongDeg DOUBLE PRECISION,
    ElevFt INTEGER, -- Em metros
    Continent CHAR(2),
    ISOCountry CHAR(2),
    ISORegion CHAR(7),
    City TEXT,
    Scheduled_service CHAR(3),
    GPSCode CHAR(4),
    IATACode CHAR(3),
    LocalCode CHAR(7),
    HomeLink TEXT,
    WikipediaLink TEXT,
    Keywords TEXT,
	EC TEXT
    );

COMMENT ON TABLE Airports IS 'Airports in the World. HTML: https://ourairports.com/data/.  The primary key for interoperability purposes with other datasets is ident, but the actual internal OurAirports primary key is id.';
COMMENT ON COLUMN Airports.Ident      IS 'Text identifier. It is the ICAO code if available. Otherwise, it will be a local airport code (if no conflict), or if nothing else is available, an internally-generated code starting with the ISO2 country code, followed by a dash and a four-digit number.';
COMMENT ON COLUMN Airports.Type       IS 'Type of the airport. Allowed values: "closed_airport", "heliport", "large_airport", "medium_airport", "seaplane_base", or "small_airport".';
COMMENT ON COLUMN Airports.Name       IS 'Official airport name, including "Airport", "Airstrip", etc.';
COMMENT ON COLUMN Airports.LatDeg     IS 'The airport latitude in decimal degrees (positive for north).';
COMMENT ON COLUMN Airports.LongDeg    IS 'The airport longitude in decimal degrees (positive for east).';
COMMENT ON COLUMN Airports.ElevFt     IS 'The airport elevation MSL in feet (not metres).';
COMMENT ON COLUMN Airports.Continent  IS 'Continent where the airport is (primarily) located. Allowed values: "AF" (Africa), "AN" (Antarctica), "AS" (Asia), "EU" (Europe), "NA" (North America), "OC" (Oceania), or "SA" (South America).';
COMMENT ON COLUMN Airports.ISOCountry IS 'Two-character ISO 3166:1-alpha2 code for the country. A handful of unofficial, non-ISO codes are also in use, such as "XK" for Kosovo. Refers to the Code column in countries.csv.';
COMMENT ON COLUMN Airports.ISORegion  IS 'Alphanumeric code for the high-level administrative subdivision of a country where the airport is primarily located (e.g. province, governorate), prefixed by the ISO2 country code and a hyphen.';
COMMENT ON COLUMN Airports.City       IS 'The primary municipality that the airport serves (when available). This may not be the municipality where the airport is physically located.';
COMMENT ON COLUMN Airports.Scheduled_service IS '"yes" if the airport currently has scheduled airline service; "no" otherwise.';
COMMENT ON COLUMN Airports.GPSCode    IS 'The code that an aviation GPS database (such as Jeppesen or Garmin) would normally use for the airport. This will always be the ICAO code if one exists. Unlike the Ident column, this is not guaranteed to be globally unique.';
COMMENT ON COLUMN Airports.IATACode   IS 'Three-letter IATA code (if it has one).';
COMMENT ON COLUMN Airports.LocalCode  IS 'Local country code, if different from GPSCode and IATACode fields (used mainly for US airports).';
COMMENT ON COLUMN Airports.HomeLink   IS 'URL of the airport''s official home page on the web, if exists.';
COMMENT ON COLUMN Airports.WikipediaLink IS 'URL of the airport''s page on Wikipedia, if exists.';
COMMENT ON COLUMN Airports.Keywords   IS 'Extra keywords/phrases to assist with search, comma-separated. May include former names for the airport, alternate codes, names in other languages, nearby tourist destinations, etc. ';


--== Countries z
DROP TABLE IF EXISTS Countries CASCADE;
CREATE TABLE Countries(
    Id 	INTEGER,
    Code CHAR(2),
    Name TEXT,
    Continent CHAR(2),
    WikipediaLink TEXT,
    Keywords TEXT
    );

--== GeoCities15K 
DROP TABLE IF EXISTS GeoCities15K CASCADE;
CREATE TABLE GeoCities15K(
    GeoNameId      INTEGER, -- PRIMARY KEY
    Name           TEXT,
    AsciiName      TEXT,
    AlternateNames TEXT,
    Lat            NUMERIC(13,5),
    Long           NUMERIC(13,5),
    FeatureClass   CHAR(1),
    FeatureCode    TEXT,
    Country        CHAR(2),
    CC2            TEXT,
    Admin1Code     TEXT,
    Admin2Code     TEXT,
    Admin3Code     TEXT,
    Admin4Code     TEXT,
    Population     BIGINT,
    Elevation      BIGINT,
    Dem            BIGINT,
    TimeZone       TEXT,
    Modification   DATE
    );

COMMENT ON TABLE GeoCities15K IS 'Cities around the worlds with Population>15000 inhabitants or is a Capital. Obtained from:  http://download.geonames.org/export/dump/, file cities15000.zip ';
COMMENT ON TABLE Countries IS 'Countries in the World. HTML: https://ourairports.com/data/.';
COMMENT ON COLUMN Countries.Code          IS 'Two-character ISO 3166:1-alpha2 code for the country. A handful of unofficial, non-ISO codes are also in use, such as "XK" for Kosovo. The iso_country field in Countries.csv Points into this column.';
COMMENT ON COLUMN Countries.Name          IS 'Common English-language name for the country. Other variations of the name may appear in the keywords field to assist with search.';
COMMENT ON COLUMN Countries.Continent     IS 'Code for the continent where the country is (primarily) located. Allowed values: "AF" (Africa), "AN" (Antarctica), "AS" (Asia), "EU" (Europe), "NA" (North America), "OC" (Oceania), or "SA" (South America).';
COMMENT ON COLUMN Countries.WikipediaLink IS 'URL of the Wikipedia article about the country.';
COMMENT ON COLUMN Countries.Keywords      IS 'Comma-separated list of search keywords/phrases related to the country.';


---- A tabela GeoCities15KTEXT original pode ter valores que violam os tipos de dados dos atributos definidos.
----     Então, le a tabela considerando o texto original, e depois trata cada campo isoladamente, internamente.
DROP TABLE IF EXISTS GeoCities15KTEXT CASCADE;
CREATE TABLE GeoCities15KTEXT(
    Tupla TEXT
    );


--==============================================================================================================
--== Carrega as tabelas ========================================================================================

PERFORM LoadFile(DirLocal, 'circuits.csv', 'Circuits', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'constructors.csv', 'Constructors', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
-- PERFORM LoadFile(DirLocal, 'ConstructorResults.csv', 'ConstructorResults', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
-- PERFORM LoadFile(DirLocal, 'ConstructorStandings.csv', 'ConstructorStandings', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'driver_standings.csv', 'DriverStandings', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'drivers.csv', 'Driver', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'lap_times.csv', 'LapTimes', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'pit_stops.csv', 'PitStops', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'qualifying.csv', 'Qualifying', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'races.csv', 'Races', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'results.csv', 'Results', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'seasons.csv', 'Seasons', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'status.csv', 'Status', 'DELIMITER '','', NULL ''\N'', HEADER true, FORMAT CSV');

PERFORM LoadFile(DirLocal, 'airports.csv', 'Airports', 'DELIMITER '','', NULL '''', HEADER true, FORMAT CSV');
PERFORM LoadFile(DirLocal, 'countries.csv', 'Countries', 'DELIMITER '','', NULL '''', HEADER true, FORMAT CSV');

---- -- Faz a leitura da tabela Cities15K como uma coleção de linhas ---------------------------------------------------
PERFORM LoadFile(DirLocal, 'cities15000.tsv', 'GeoCities15KTEXT', 'DELIMITER E''\b'', NULL '''', HEADER false');
END $$;

---- -- Tratar a tabela GeoCities15K ------------------------------------------------------------------------
---- -- Copia cada linha isolando cada valor como um campo de texto separado em cada atributo da tabela alvo.
----    Executa os comandos dentro de uma transação para executar as converções no Estilo de data usado no arquivo 
----    lido, e depois retornar para o estilo original da base de dados.
START TRANSACTION; --======================================================================

SET DateStyle to YMD, ISO;
INSERT INTO GeoCities15K 
    SELECT (string_to_array(Tupla, E'\t'))[1]::INTEGER AS GeoNameId,
           (string_to_array(Tupla, E'\t'))[2]  AS Name,
           (string_to_array(Tupla, E'\t'))[3]  AS AsciiName,
           (string_to_array(Tupla, E'\t'))[4]  AS AlternateNames,
           NULLIF((string_to_array(Tupla, E'\t'))[5],'')::NUMERIC(13,5) AS Lat,
           NULLIF((string_to_array(Tupla, E'\t'))[6],'')::NUMERIC(13,5) AS Long,
           (string_to_array(Tupla, E'\t'))[7]  AS FeatureClass,
           (string_to_array(Tupla, E'\t'))[8]  AS FeatureCode,
           (string_to_array(Tupla, E'\t'))[9]  AS Country,
           (string_to_array(Tupla, E'\t'))[10] AS CC2,
           (string_to_array(Tupla, E'\t'))[11] AS Admin1Code,
           (string_to_array(Tupla, E'\t'))[12] AS Admin2Code,
           (string_to_array(Tupla, E'\t'))[13] AS Admin3Code,
           (string_to_array(Tupla, E'\t'))[14] AS Admin4Code,
           NULLIF((string_to_array(Tupla, E'\t'))[15],'')::BIGINT  AS Population,
           NULLIF((string_to_array(Tupla, E'\t'))[16],'')::INTEGER AS Elevation,
           NULLIF((string_to_array(Tupla, E'\t'))[17],'')::INTEGER AS DEM,
           (string_to_array(Tupla, E'\t'))[18] AS TimeZone,
           NULLIF((string_to_array(Tupla, E'\t'))[19],'')::DATE AS Modification
       FROM GeoCities15KTEXT;
DROP TABLE GeoCities15KTEXT; -- A tabela em formato de texto já pode ser descartada.
COMMIT;

--==============================================================================================================
--== Corrige os dados das tabelas para o objetivo do projeto ===================================================

--== Formula 1

--== Aeroportos
ALTER TABLE Airports
          ADD CONSTRAINT AirportPK PRIMARY KEY(Ident),
          DROP COLUMN Id;
ALTER TABLE Countries 
          DROP COLUMN Id, 
          DROP COLUMN WikipediaLink;


--== Altera tabelas para incluir chaves estrangeiras
ALTER TABLE Driverstandings ADD CONSTRAINT fk_driver FOREIGN KEY (DriverId) REFERENCES Driver(DriverId);
ALTER TABLE Driverstandings ADD CONSTRAINT fk_race FOREIGN KEY (RaceId) REFERENCES Races(RaceId);

ALTER TABLE LapTimes ADD CONSTRAINT fk_driver FOREIGN KEY (DriverId) REFERENCES Driver(DriverId);
ALTER TABLE LapTimes ADD CONSTRAINT fk_race FOREIGN KEY (RaceId) REFERENCES Races(RaceId);

ALTER TABLE PitStops ADD CONSTRAINT fk_race FOREIGN KEY (RaceId) REFERENCES Races(RaceId);
ALTER TABLE PitStops ADD CONSTRAINT fk_driver FOREIGN KEY (DriverId) REFERENCES Driver(DriverId);

ALTER TABLE Qualifying ADD CONSTRAINT fk_driver FOREIGN KEY (DriverId) REFERENCES Driver(DriverId);
ALTER TABLE Qualifying ADD CONSTRAINT fk_race FOREIGN KEY (RaceId) REFERENCES Races(RaceId);
ALTER TABLE Qualifying ADD CONSTRAINT fk_constructor FOREIGN KEY (ConstructorId) REFERENCES Constructors(ConstructorId);

ALTER TABLE Races ADD CONSTRAINT fk_season FOREIGN KEY (year) REFERENCES Seasons(year);
ALTER TABLE Races ADD CONSTRAINT fk_circuits FOREIGN KEY (CircuitId) REFERENCES Circuits(CircuitId);

ALTER TABLE Results ADD CONSTRAINT fk_driver FOREIGN KEY (DriverId) REFERENCES Driver(DriverId);
ALTER TABLE Results ADD CONSTRAINT fk_race FOREIGN KEY (RaceId) REFERENCES Races(RaceId);
ALTER TABLE Results ADD CONSTRAINT fk_constructor FOREIGN KEY (ConstructorId) REFERENCES Constructors(ConstructorId);
ALTER TABLE Results ADD CONSTRAINT fk_status FOREIGN KEY (StatusId) REFERENCES Status(statusId);

CREATE VIEW Tables AS
    SELECT 'Circuits'             AS Table, Count(*) NroTuplas FROM Circuits UNION
    SELECT 'Constructors'         AS Table, Count(*) NroTuplas FROM Constructors UNION
    -- SELECT 'ConstructorResults'   AS Table, Count(*) NroTuplas FROM ConstructorResults UNION
    -- SELECT 'ConstructorStandings' AS Table, Count(*) NroTuplas FROM ConstructorStandings UNION
    SELECT 'DriverStandings'      AS Table, Count(*) NroTuplas FROM DriverStandings UNION
    SELECT 'Driver'               AS Table, Count(*) NroTuplas FROM Driver UNION
    SELECT 'LapTimes'             AS Table, Count(*) NroTuplas FROM LapTimes UNION
    SELECT 'PitStops'             AS Table, Count(*) NroTuplas FROM PitStops UNION
    SELECT 'Qualifying'           AS Table, Count(*) NroTuplas FROM Qualifying UNION
    SELECT 'Races'                AS Table, Count(*) NroTuplas FROM Races UNION
    SELECT 'Results'              AS Table, Count(*) NroTuplas FROM Results UNION
    SELECT 'Seasons'              AS Table, Count(*) NroTuplas FROM Seasons UNION
    SELECT 'Status'               AS Table, Count(*) NroTuplas FROM Status UNION
    SELECT 'Airports'             AS Table, Count(*) NroTuplas FROM Airports UNION
    SELECT 'Countries'            AS Table, Count(*) NroTuplas FROM Countries UNION
    SELECT 'GeoCities15K'         AS Table, Count(*) NroTuplas FROM GeoCities15K;

Table Tables;