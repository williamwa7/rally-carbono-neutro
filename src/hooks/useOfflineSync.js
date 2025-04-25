// src/hooks/useOfflineSync.js
import { useState, useCallback } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';
import { exportToExcel } from '../../lib/excelExport.js';

export const useOfflineSync = () => {
  const { isOnline, syncWithGoogleSheets, vehicles } = useDatabase();
  const [syncing, setSyncing] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState(null);
  const [exporting, setExporting] = useState(false);
  
  // Função para sincronizar com Google Sheets
  const handleSync = useCallback(async () => {
    if (!isOnline) {
      setLastSyncStatus({
        success: false,
        message: "Dispositivo offline. Não é possível sincronizar agora."
      });
      return;
    }
    
    try {
      setSyncing(true);
      const result = await syncWithGoogleSheets();
      setLastSyncStatus(result);
      return result;
    } catch (error) {
      const errorStatus = {
        success: false,
        message: `Erro na sincronização: ${error.message}`
      };
      setLastSyncStatus(errorStatus);
      return errorStatus;
    } finally {
      setSyncing(false);
    }
  }, [isOnline, syncWithGoogleSheets]);
  
  // Função para exportar para Excel
  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      const result = exportToExcel(vehicles);
      return result;
    } catch (error) {
      return {
        success: false,
        message: `Erro na exportação: ${error.message}`
      };
    } finally {
      setExporting(false);
    }
  }, [vehicles]);
  
  return {
    isOnline,
    syncing,
    exporting,
    lastSyncStatus,
    syncWithGoogleSheets: handleSync,
    exportToExcel: handleExport
  };
};