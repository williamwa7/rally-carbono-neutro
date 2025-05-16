// src/services/excelImportService.js

import * as XLSX from 'xlsx';
import { addVehicle, getAllVehicles } from '../db/indexedDB';

/**
 * Processa um arquivo Excel e importa os veículos para o banco de dados
 * @param {File} file - Arquivo Excel a ser processado
 * @returns {Promise<{total: number, imported: number, errors: Array}>}
 */
export const importVehiclesFromExcel = async (file) => {
    return new Promise((resolve, reject) => {
        // Verificar se o arquivo é válido
        if (!file || !(file instanceof File)) {
            reject('Arquivo inválido. Por favor, selecione um arquivo Excel válido.');
            return;
        }

        // Verificar extensão do arquivo
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(fileExt)) {
            reject('Formato de arquivo não suportado. Use arquivos .xlsx, .xls ou .csv');
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                // Ler o arquivo Excel
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Pegar primeira planilha
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Converter para JSON
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (rows.length < 2) {
                    reject('A planilha não contém dados suficientes. Verifique o formato.');
                    return;
                }

                // Mapear cabeçalhos
                const headers = rows[0].map(h => String(h).trim().toLowerCase());

                // Verificar se os cabeçalhos necessários estão presentes
                const requiredFields = ['vehicle', 'number', 'team', 'pilot', 'country'];
                const missingFields = [];

                // Mapear cabeçalhos alternativos aceitáveis
                const headerMappings = {
                    'veículo': 'vehicle',
                    'carro': 'vehicle',
                    'nome': 'vehicle',
                    'name': 'vehicle',
                    'número': 'number',
                    'numero': 'number',
                    'n': 'number',
                    'number': 'number',
                    'num': 'number',
                    'no': 'number',
                    'nº': 'number',
                    'equipe': 'team',
                    'time': 'team',
                    'piloto': 'pilot',
                    'condutor': 'pilot',
                    'motorista': 'pilot',
                    'driver': 'pilot',
                    'pais': 'country',
                    'country': 'country',
                    'país': 'country'
                };

                // Verificar se todos os campos obrigatórios estão presentes (considerando alternativas)
                const normalizedHeaders = headers.map(h => headerMappings[h] || h);

                for (const field of requiredFields) {
                    if (!normalizedHeaders.includes(field)) {
                        missingFields.push(field);
                    }
                }

                if (missingFields.length > 0) {
                    reject(`Campos obrigatórios não encontrados: ${missingFields.join(', ')}. 
            Certifique-se de que sua planilha tenha colunas para: veículo, número, equipe e piloto.`);
                    return;
                }

                // Processar as linhas de dados
                const result = {
                    total: rows.length - 1, // Total de linhas menos o cabeçalho
                    imported: 0,
                    errors: []
                };

                // Para cada linha de dados (exceto o cabeçalho)
                for (let i = 1; i < rows.length; i++) {
                    try {
                        const row = rows[i];
                        if (row.length === 0 || !row.some(cell => cell)) {
                            // Pular linhas vazias
                            continue;
                        }

                        // Criar objeto de veículo
                        const vehicleData = {};

                        // Mapear os dados baseado nos cabeçalhos
                        headers.forEach((header, index) => {
                            const normalizedHeader = headerMappings[header] || header;
                            if (requiredFields.includes(normalizedHeader)) {
                                // Garantir que valores não sejam undefined
                                vehicleData[normalizedHeader] = row[index] !== undefined ? String(row[index]) : '';
                            }
                        });

                        // Verificar se todos os campos obrigatórios têm valores
                        const hasAllRequiredFields = requiredFields.every(field =>
                            vehicleData[field] !== undefined
                            // && vehicleData[field] !== ''
                        );

                        if (hasAllRequiredFields) {
                            // Adicionar veículo ao banco de dados
                            await addVehicle({
                                vehicle: vehicleData.vehicle,
                                number: vehicleData.number || '',
                                team: vehicleData.team,
                                pilot: vehicleData.pilot,
                                country: vehicleData.country
                            });

                            result.imported++;
                        } else {
                            result.errors.push(`Linha ${i + 1}: Dados incompletos`);
                        }
                    } catch (error) {
                        result.errors.push(`Linha ${i + 1}: ${error.message || 'Erro desconhecido'}`);
                    }
                }

                resolve(result);
            } catch (error) {
                reject(`Erro ao processar arquivo: ${error.message || 'Erro desconhecido'}`);
            }
        };

        reader.onerror = () => {
            reject('Erro ao ler o arquivo. Verifique se o arquivo não está corrompido.');
        };

        // Ler o arquivo como um array buffer
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Gera um arquivo Excel com os veículos cadastrados
 * @returns {Promise<Blob>} - Arquivo Excel para download
 */
export const exportVehiclesToExcel = async () => {
    try {
        // Obter todos os veículos do banco de dados
        const vehicles = await getAllVehicles();

        if (vehicles.length === 0) {
            throw new Error('Não há veículos cadastrados para exportar.');
        }

        // Mapear dados para formato adequado para o Excel
        const data = vehicles.map(vehicle => ({
            'Veículo': vehicle.name || '',
            'Número': vehicle.number || '',
            'Equipe': vehicle.team || '',
            'Piloto': vehicle.pilot || '',
            'Sincronizado': vehicle.synced ? 'Sim' : 'Não',
            'Última Atualização': vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleString() : ''
        }));

        // Criar workbook e worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Adicionar worksheet ao workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Veículos');

        // Gerar arquivo Excel
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Converter para Blob para download
        return new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
    } catch (error) {
        throw new Error(`Erro ao exportar veículos: ${error.message}`);
    }
};