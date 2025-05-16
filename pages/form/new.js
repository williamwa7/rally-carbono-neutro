// src/pages/form/new.js (continuação)
import { useGeneralContext } from '@/src/contexts/GeneralContext';
import React from 'react';
import Layout from '../../src/components/Layout';
import VehicleForm from '../../src/components/VehicleForm';

export default function NewVehiclePage() {
  const { texts } = useGeneralContext();

  return (
    <Layout title="Novo Veículo">
      <h1 className="h3 mb-4 text-center">{texts.addNovoVeiculo}</h1>
      
      <VehicleForm id="new" />
    </Layout>
  );
}