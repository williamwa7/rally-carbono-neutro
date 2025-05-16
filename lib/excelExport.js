// src/lib/excelExport.js
import * as XLSX from 'xlsx';

// Função para formatar dados para o Excel
const formatVehiclesForExport = (vehicles) => {
  return vehicles.map(vehicle => ({
    // 'ID': vehicle.id,
    // 'Nome do Veículo': vehicle.team || '',
    // 'Número': vehicle.number || '',
    // 'Equipe': vehicle.team || '',
    // 'Piloto': vehicle.pilot || '',
    // 'Combustível': vehicle.fuel || '',
    // 'Local de Origem': vehicle.origin || '',
    // 'Última Atualização': vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleString() : '',
    // 'Sincronizado': vehicle.synced ? 'Sim' : 'Não'
    'ID': vehicle.id,
    'Equipe': vehicle.team || '',
    'Piloto': vehicle.pilot || '',
    'Número': vehicle.number || '',
    'Veículo': vehicle.vehicle || '',
    'Ano': vehicle.year || '',
    'Combustível': vehicle.fuel || '',
    'Consumo em Prova': vehicle.consumptionInRace || '',
    'Consumo em Deslocamento': vehicle.displacementConsumption || '',
    '-': '',
    // deslocamento até o evento    
    'Local de Origem': vehicle.origin || '',
    'Veículo (deslocamento)': vehicle.vehicleDisplacement || '',
    'Combustível (deslocamento)': vehicle.fuelDisplacement || '',
    'Ano do veículo (deslocamento)': vehicle.yearVehicDispl || '',
  }));
};

// Função para exportar dados para Excel
export const exportToExcel = (vehicles, filename = 'Coleta_de_Dados_Rally_' + new Date().getFullYear()) => {
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