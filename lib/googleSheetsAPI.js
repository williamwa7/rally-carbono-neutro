// src/lib/googleSheetsAPI.js
import { google } from 'googleapis';

// Função para autenticar com Google Sheets usando service account
const authenticate = async () => {
  try {
    // Carregar credenciais da service account
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    return { auth, sheets };
  } catch (error) {
    console.error('Erro ao autenticar com Google Sheets:', error);
    throw new Error(`Falha na autenticação: ${error.message}`);
  }
};

// Função para verificar se a planilha existe, caso contrário criar
export const getOrCreateSpreadsheet = async () => {
  try {
    const { auth, sheets } = await authenticate();
    
    // Verificar se já temos o ID da planilha salvo
    let spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    // Se não tiver ID, criar uma nova planilha
    if (!spreadsheetId) {
      const response = await sheets.spreadsheets.create({
        resource: {
          properties: {
            title: 'Rally Carbono Neutro - Dados'
          },
          sheets: [
            {
              properties: {
                title: 'Veículos',
                gridProperties: {
                  frozenRowCount: 1
                }
              }
            }
          ]
        }
      });
      
      spreadsheetId = response.data.spreadsheetId;
      
      // Configurar cabeçalhos
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Veículos!A1:I1',
        valueInputOption: 'RAW',
        resource: {
          values: [[
            'ID', 'Nome do Veículo', 'Número', 'Equipe', 'Piloto', 
            'Combustível', 'Local de Origem', 'Data de Atualização', 'ID do Dispositivo'
          ]]
        }
      });
      
      console.log(`Nova planilha criada com ID: ${spreadsheetId}`);
    }
    
    return spreadsheetId;
  } catch (error) {
    console.error('Erro ao criar/obter planilha:', error);
    throw new Error(`Falha ao acessar planilha: ${error.message}`);
  }
};

// Função para sincronizar dados com a planilha
export const syncDataToSheet = async (vehicles) => {
  try {
    const { sheets } = await authenticate();
    const spreadsheetId = await getOrCreateSpreadsheet();
    
    // Preparar os dados para inserção
    const values = vehicles.map(vehicle => [
      vehicle.id.toString(),
      vehicle.name || '',
      vehicle.number || '',
      vehicle.team || '',
      vehicle.pilot || '',
      vehicle.fuel || '',
      vehicle.origin || '',
      vehicle.updatedAt || new Date().toISOString(),
      vehicle.deviceId || ''
    ]);
    
    // Atualizar ou anexar os dados
    // Primeiro verificamos se já existem entradas com os mesmos IDs
    for (const vehicle of vehicles) {
      // Buscar linha com o ID do veículo
      const searchResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Veículos!A:A',
        valueRenderOption: 'UNFORMATTED_VALUE'
      });
      
      const rows = searchResponse.data.values || [];
      let rowIndex = -1;
      
      // Encontrar a linha com o ID correspondente
      for (let i = 1; i < rows.length; i++) {
        if (rows[i] && rows[i][0] == vehicle.id) {
          rowIndex = i + 1; // +1 porque os índices na API do Sheets começam em 1
          break;
        }
      }
      
      const vehicleData = [
        vehicle.id.toString(),
        vehicle.name || '',
        vehicle.number || '',
        vehicle.team || '',
        vehicle.pilot || '',
        vehicle.fuel || '',
        vehicle.origin || '',
        vehicle.updatedAt || new Date().toISOString(),
        vehicle.deviceId || ''
      ];
      
      if (rowIndex > 0) {
        // Atualizar linha existente
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Veículos!A${rowIndex}:I${rowIndex}`,
          valueInputOption: 'RAW',
          resource: { values: [vehicleData] }
        });
      } else {
        // Adicionar nova linha
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Veículos!A:I',
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: { values: [vehicleData] }
        });
      }
    }
    
    return {
      success: true,
      message: `${vehicles.length} veículos sincronizados com sucesso`,
      spreadsheetId
    };
  } catch (error) {
    console.error('Erro ao sincronizar com Google Sheets:', error);
    throw new Error(`Falha na sincronização: ${error.message}`);
  }
};