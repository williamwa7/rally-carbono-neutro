// src/pages/form/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../src/components/Layout';
import VehicleForm from '../../src/components/VehicleForm';
import { useGeneralContext } from '@/src/contexts/GeneralContext';

export default function VehicleFormPage() {
  const { texts } = useGeneralContext();

  const router = useRouter();
  const { id } = router.query;
  
  return (
    <Layout title={id === 'new' ? texts.addNovoVeiculo : texts.editarVeiculo}>
      <h1 className="h3 mb-4 text-center">
        {id === 'new' ? texts.addNovoVeiculo : texts.editarVeiculo}
      </h1>
      
      {id && <VehicleForm id={id} />}
    </Layout>
  );
}