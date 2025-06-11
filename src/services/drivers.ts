import api from './api';

// Interface baseada na função get_drivers do banco de dados
// que retorna: driver_id, driver_name, total_pontos
export interface Driver {
  driver_id: number;
  driver_name: string;
  total_pontos: number;
}

// Interface para o resultado da função fn_piloto_estatisticas_ano_circuito
export interface PilotoEstatisticasAnoCircuito {
  ano: number;
  circuito_id: number;
  circuito_nome: string;
  total_pontos: number;
  total_vitorias: number;
  total_corridas: number;
}

// Interface para o resultado da função fn_piloto_anos_atividade
export interface PilotoAnosAtividade {
  primeiro_ano: number;
  ultimo_ano: number;
}

// Interface para o resultado da função fn_piloto_pontos_por_ano
export interface PilotoPontosPorAno {
  ano: number;
  corrida: string;
  pontos: number;
}

// Interface para o resultado da função get_drivers_by_forename_and_constructor
export interface DriverByForenameAndConstructor {
  full_name: string;
  dob: string; // Será convertido para string no formato ISO
  nationality: string;
}

/**
 * Chama a função get_drivers do banco de dados
 * que retorna os pilotos com a soma total dos pontos obtidos nas corridas do ano atual
 * 
 * A função SQL retorna uma TABLE com:
 * - driver_id: d.driverId
 * - driver_name: d.forename || ' ' || d.surname
 * - total_pontos: SUM(res.points)::DOUBLE PRECISION
 */
export const getDrivers = async (): Promise<Driver[]> => {
  try {
    // PostgREST permite chamar funções usando rpc/
    const { data } = await api.post<Driver[]>('/rpc/get_drivers');
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar pilotos:', error);
    throw new Error('Erro ao carregar dados dos pilotos');
  }
};

/**
 * Chama a função fn_piloto_estatisticas_ano_circuito do banco de dados
 * que retorna estatísticas do piloto por ano e circuito
 * 
 * A função SQL retorna uma TABLE com:
 * - ano: r.year
 * - circuito_id: r.circuitId
 * - circuito_nome: c.name
 * - total_pontos: COALESCE(SUM(res.points)::double precision, 0)
 * - total_vitorias: COUNT(CASE WHEN res.positionOrder = 1 THEN 1 END)
 * - total_corridas: COUNT(DISTINCT res.raceId)
 */
export const getPilotoEstatisticasAnoCircuito = async (driverId: number): Promise<PilotoEstatisticasAnoCircuito[]> => {
  try {
    const { data } = await api.post<PilotoEstatisticasAnoCircuito[]>('/rpc/fn_piloto_estatisticas_ano_circuito', {
      driver_id: driverId
    });
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar estatísticas do piloto por ano e circuito:', error);
    throw new Error('Erro ao carregar estatísticas do piloto');
  }
};

/**
 * Chama a função fn_piloto_anos_atividade do banco de dados
 * que retorna o primeiro e último ano com dados do piloto
 * 
 * A função SQL retorna uma TABLE com:
 * - primeiro_ano: MIN(r.year)
 * - ultimo_ano: MAX(r.year)
 */
export const getPilotoAnosAtividade = async (driverId: number): Promise<PilotoAnosAtividade | null> => {
  try {
    const { data } = await api.post<PilotoAnosAtividade[]>('/rpc/fn_piloto_anos_atividade', {
      driver_id: driverId
    });
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Erro ao buscar anos de atividade do piloto:', error);
    throw new Error('Erro ao carregar anos de atividade do piloto');
  }
};

/**
 * Chama a função fn_piloto_pontos_por_ano do banco de dados
 * que retorna pontos por ano e corrida do piloto
 * 
 * A função SQL retorna uma TABLE com:
 * - ano: ra.year
 * - corrida: ra.name
 * - pontos: re.points
 */
export const getPilotoPontosPorAno = async (driverId: number): Promise<PilotoPontosPorAno[]> => {
  try {
    const { data } = await api.post<PilotoPontosPorAno[]>('/rpc/fn_piloto_pontos_por_ano', {
      driver_id: driverId
    });
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar pontos do piloto por ano:', error);
    throw new Error('Erro ao carregar pontos do piloto por ano');
  }
};

// Manter a interface original para compatibilidade com outras partes do sistema
export interface DriverOriginal {
  driverid: number;
  driverref: string;
  number: number;
  code: string;
  forename: string;
  surname: string;
  dob: string; // ISO date string
  nationality: string;
  url: string;
}

export const searchDriversByName = (name: string): Promise<DriverOriginal[]> =>
  api
    .get<DriverOriginal[]>(`/driver?or=(forename.ilike.*${name}*,surname.ilike.*${name}*)&order=surname.asc`)
    .then(res => res.data);

export const createDriver = (driver: Omit<DriverOriginal, 'driverid'>) =>
  api.post<DriverOriginal>('/driver', driver)
      .then(res => res.data);

/**
 * Cria um novo piloto usando a função fn_create_driver do banco de dados
 * A função recebe: p_number, p_code, p_forename, p_surname, p_dob, p_nationality, p_url
 * e gera automaticamente o driver_ref baseado no sobrenome
 */
export const createDriverWithFunction = async (
  number: number,
  code: string,
  forename: string,
  surname: string,
  dob: string,
  nationality: string,
  url: string
): Promise<void> => {
  try {
    await api.post('/rpc/fn_create_driver', {
      p_number: number,
      p_code: code,
      p_forename: forename,
      p_surname: surname,
      p_dob: dob,
      p_nationality: nationality,
      p_url: url
    });
  } catch (error) {
    console.error('Erro ao criar piloto:', error);
    throw new Error('Erro ao cadastrar piloto');
  }
};

/**
 * Processa um arquivo CSV no frontend e cadastra pilotos usando a função fn_create_driver
 * para cada linha do arquivo
 */
export const uploadDriversCSV = async (file: File): Promise<void> => {
  try {
    // Lê o conteúdo do arquivo
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      throw new Error('Arquivo CSV está vazio');
    }

    // Assume que a primeira linha contém os cabeçalhos
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Verifica se as colunas necessárias estão presentes
    const requiredColumns = ['forename', 'surname'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`);
    }

    // Processa cada linha de dados (pula o cabeçalho)
    const dataLines = lines.slice(1);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, '')); // Remove aspas se houver
      
      if (values.length !== headers.length) {
        errors.push(`Linha ${i + 2}: número de colunas incorreto`);
        errorCount++;
        continue;
      }

      // Mapeia os valores para um objeto
      const rowData: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });

      try {
        // Chama a função fn_create_driver com os dados da linha
        await createDriverWithFunction(
          parseInt(rowData.number) || 0,
          rowData.code || '',
          rowData.forename,
          rowData.surname,
          rowData.dob || '1990-01-01', // Data padrão se não fornecida
          rowData.nationality || '',
          rowData.url || ''
        );
        successCount++;
      } catch (error) {
        errors.push(`Linha ${i + 2}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        errorCount++;
      }
    }

    if (errorCount > 0) {
      console.warn('Alguns pilotos não puderam ser cadastrados:', errors);
    }

    if (successCount === 0) {
      throw new Error('Nenhum piloto foi cadastrado com sucesso');
    }

    console.log(`Upload concluído: ${successCount} pilotos cadastrados, ${errorCount} erros`);
  } catch (error) {
    console.error('Erro ao processar arquivo CSV:', error);
    throw new Error(error instanceof Error ? error.message : 'Erro ao processar arquivo CSV de pilotos');
  }
};

/**
 * Chama a função get_drivers_by_forename_and_constructor do banco de dados
 * que retorna pilotos que já correram pela escuderia e têm o forename pesquisado
 * 
 * A função SQL retorna uma TABLE com:
 * - full_name: d.forename || ' ' || d.surname
 * - dob: d.dob
 * - nationality: d.nationality
 */
export const getDriversByForenameAndConstructor = async (
  searchForename: string, 
  constructorId: number
): Promise<DriverByForenameAndConstructor[]> => {
  try {
    const { data } = await api.post<DriverByForenameAndConstructor[]>('/rpc/get_drivers_by_forename_and_constructor', {
      search_forename: searchForename,
      constructor_id_input: constructorId
    });
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar pilotos por nome e escuderia:', error);
    throw new Error('Erro ao carregar pilotos da escuderia');
  }
};