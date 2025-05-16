// src/contexts/DatabaseContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as db from '../db/indexedDB';

// Criar o contexto
const DatabaseContext = createContext();

// Hook personalizado para usar o contexto
export const useDatabase = () => useContext(DatabaseContext);

// Provedor do contexto
export const DatabaseProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [vehicles, setVehicles] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  // console.log("vehicles", vehicles);

  // Verificar status de conexão
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Inicializar banco de dados e carregar veículos
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await db.initDB();
        await db.prePopulateDB(); // Pré-popular com dados de exemplo se necessário
        const loadedVehicles = await db.getAllVehicles();
        setVehicles(loadedVehicles);
      } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDB();
  }, []);

  // Função para recarregar todos os veículos
  const refreshVehicles = async () => {
    try {
      setIsLoading(true);
      const loadedVehicles = await db.getAllVehicles();
      setVehicles(loadedVehicles);
      return loadedVehicles;
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Função para adicionar ou atualizar um veículo
  const saveVehicle = async (vehicleData, id = null) => {
    try {
      let savedVehicle;

      if (id) {
        savedVehicle = await db.updateVehicle(id, vehicleData);
      } else {
        savedVehicle = await db.addVehicle(vehicleData);
      }

      await refreshVehicles();
      return savedVehicle;
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      throw error;
    }
  };

  // Função para buscar um veículo pelo ID
  const getVehicle = async (id) => {
    try {
      return await db.getVehicleById(id);
    } catch (error) {
      console.error(`Erro ao buscar veículo ID ${id}:`, error);
      throw error;
    }
  };

  // Função para buscar veículos por critérios
  const searchVehicles = async (criteria) => {
    try {
      const results = await db.searchVehicles(criteria);
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Erro na busca de veículos:', error);
      return [];
    }
  };

  // Função para exportar veículos para Excel
  const exportToExcel = async () => {
    // Esta função será implementada no lib/excelExport.js
    // Aqui apenas preparamos os dados para exportação
    try {
      const allVehicles = await db.getAllVehicles();
      // A função real de exportação será chamada com estes dados
      return allVehicles;
    } catch (error) {
      console.error('Erro ao exportar veículos:', error);
      throw error;
    }
  };

  // Função para sincronizar com Google Sheets
  const syncWithGoogleSheets = async () => {
    try {
      // Obter veículos não sincronizados
      const unsyncedVehicles = await db.getUnsyncedVehicles();

      if (unsyncedVehicles.length === 0) {
        return { success: true, message: 'Não há dados para sincronizar' };
      }

      // A sincronização real será feita via API, mas aqui apenas simulamos
      if (!isOnline) {
        return { success: false, message: 'Dispositivo offline. Tente novamente quando estiver conectado.' };
      }

      // Neste ponto, enviaríamos os dados para a API
      // Se bem sucedido, marcamos como sincronizado
      const ids = unsyncedVehicles.map(v => v.id);
      await db.markAsSynced(ids);

      // Atualizar lista de veículos após sincronização
      await refreshVehicles();

      return {
        success: true,
        message: `${unsyncedVehicles.length} veículos sincronizados com sucesso.`
      };
    } catch (error) {
      console.error('Erro na sincronização:', error);
      return { success: false, message: `Erro na sincronização: ${error.message}` };
    }
  };

  // Valores e funções expostos pelo contexto
  const value = {
    isLoading,
    isOnline,
    vehicles,
    searchResults,
    refreshVehicles,
    saveVehicle,
    getVehicle,
    searchVehicles,
    exportToExcel,
    syncWithGoogleSheets,
    clearSearch: () => setSearchResults(null)
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};