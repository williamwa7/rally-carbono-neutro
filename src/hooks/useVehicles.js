// src/hooks/useVehicles.js
import { useState, useCallback } from 'react';
import { useDatabase } from '../contexts/DatabaseContext';

export const useVehicles = () => {
  const { 
    vehicles, 
    searchResults, 
    refreshVehicles, 
    saveVehicle, 
    getVehicle, 
    searchVehicles: dbSearchVehicles,
    clearSearch
  } = useDatabase();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  
  // Função para carregar um veículo específico
  const loadVehicle = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const vehicle = await getVehicle(id);
      setCurrentVehicle(vehicle);
      return vehicle;
    } catch (err) {
      setError(`Erro ao carregar veículo: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getVehicle]);
  
  // Função para salvar/atualizar um veículo
  const handleSaveVehicle = useCallback(async (vehicleData, id = null) => {
    try {
      setLoading(true);
      setError(null);
      const saved = await saveVehicle(vehicleData, id);
      setCurrentVehicle(saved);
      return saved;
    } catch (err) {
      setError(`Erro ao salvar veículo: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [saveVehicle]);
  
  // Função para buscar veículos
  const handleSearchVehicles = useCallback(async (criteria) => {
    try {
      setLoading(true);
      setError(null);
      return await dbSearchVehicles(criteria);
    } catch (err) {
      setError(`Erro na busca: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [dbSearchVehicles]);
  
  // Função para limpar a busca e mostrar todos os veículos
  // src/hooks/useVehicles.js (continuação)
  
  // Função para limpar a busca e mostrar todos os veículos
  const handleClearSearch = useCallback(() => {
    clearSearch();
    setError(null);
  }, [clearSearch]);
  
  // Função para criar um novo veículo em branco
  const createNewVehicle = useCallback(() => {
    setCurrentVehicle({
      name: '',
      number: '',
      team: '',
      pilot: '',
      fuel: '',
      origin: ''
    });
  }, []);
  
  // Função para recarregar a lista de veículos
  const handleRefreshVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await refreshVehicles();
    } catch (err) {
      setError(`Erro ao recarregar veículos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [refreshVehicles]);
  
  return {
    vehicles,
    searchResults: searchResults || vehicles, // Se não houver resultados de busca, usar todos os veículos
    loading,
    error,
    currentVehicle,
    loadVehicle,
    saveVehicle: handleSaveVehicle,
    searchVehicles: handleSearchVehicles,
    clearSearch: handleClearSearch,
    createNewVehicle,
    refreshVehicles: handleRefreshVehicles,
    setCurrentVehicle
  };
};