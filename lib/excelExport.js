// src/lib/excelExport.js
import * as XLSX from 'xlsx';

// Função para formatar dados para o Excel
const formatVehiclesForExport = (vehicles) => {
  return vehicles.map(vehicle => ({
    'ID': vehicle.id,
    'Nome do Veículo': vehicle.name || '',
    'Número': vehicle.number || '',
    'Equipe': vehicle.team || '',
    'Piloto': vehicle.pilot || '',
    'Combustível': vehicle.fuel || '',
    'Local de Origem': vehicle.origin || '',
    'Última Atualização': vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleString() : '',
    'Sincronizado': vehicle.synced ? 'Sim' : 'Não'
  }));
};

// Função para exportar dados para Excel
export const exportToExcel = (vehicles, filename = 'rally-carbono-neutro-dados') => {
  try {
    // Formatar dados para o Excel
    const formattedData = formatVehiclesForExport(vehicles);
    
    // Criar uma nova planilha
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Configurar larguras de coluna
    const columnWidths = [
      { wch: 5 },   // ID
      { wch: 20 },  // Nome do Veículo
      { wch: 10 },  // Número
      { wch: 15 },  // Equipe
      { wch: 20 },  // Piloto
      { wch: 15 },  // Combustível
      { wch: 20 },  // Local de Origem
      { wch: 20 },  // Última Atualização
      { wch: 12 }   // Sincronizado
    ];
    
    worksheet['!cols'] = columnWidths;
    
    // Criar workbook e adicionar a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Veículos');
    
    // Adicionar timestamp ao nome do arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const fullFilename = `${filename}-${timestamp}.xlsx`;
    
    // Gerar o arquivo Excel e fazer download
    XLSX.writeFile(workbook, fullFilename);
    
    return { success: true, filename: fullFilename };
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    return { 
      success: false, 
      message: `Falha ao exportar dados: ${error.message}` 
    };
  }
};