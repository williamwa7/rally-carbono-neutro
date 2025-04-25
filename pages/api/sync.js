// src/pages/api/sync.js
import { syncDataToSheet } from '../../lib/googleSheetsAPI';

export default async function handler(req, res) {
  // Verificar se é uma requisição POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    // Obter dados enviados no corpo da requisição
    const { vehicles } = req.body;
    
    if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum dado de veículo válido fornecido' 
      });
    }
    
    // Sincronizar dados com Google Sheets
    const result = await syncDataToSheet(vehicles);
    
    // Retornar resultado
    return res.status(200).json({ 
      success: true, 
      message: `${vehicles.length} veículos sincronizados com sucesso`,
      spreadsheetId: result.spreadsheetId
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Erro na sincronização: ${error.message}`
    });
  }
}