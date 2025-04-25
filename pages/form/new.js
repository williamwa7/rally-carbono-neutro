// src/pages/form/new.js (continuação)
import React from 'react';
import Layout from '../../src/components/Layout';
import VehicleForm from '../../src/components/VehicleForm';

export default function NewVehiclePage() {
  return (
    <Layout title="Novo Veículo">
      <h1 className="h3 mb-4">Adicionar Novo Veículo</h1>
      
      <VehicleForm id="new" />
    </Layout>
  );
}