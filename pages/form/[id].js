// src/pages/form/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../src/components/Layout';
import VehicleForm from '../../src/components/VehicleForm';

export default function VehicleFormPage() {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <Layout title={id === 'new' ? 'Novo Veículo' : 'Editar Veículo'}>
      <h1 className="h3 mb-4">
        {id === 'new' ? 'Adicionar Novo Veículo' : 'Editar Veículo'}
      </h1>
      
      {id && <VehicleForm id={id} />}
    </Layout>
  );
}