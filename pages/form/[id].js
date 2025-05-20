// src/pages/form/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../src/components/Layout';
import VehicleForm from '../../src/components/VehicleForm';
import { useGeneralContext } from '@/src/contexts/GeneralContext';
import Link from 'next/link';

export default function VehicleFormPage() {
  const { texts } = useGeneralContext();

  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title={id === 'new' ? texts.addNovoVeiculo : texts.editarVeiculo}>
      {/* <h1 className="h3 mb-4 text-center">        
        {id === 'new' ? texts.addNovoVeiculo : texts.editarVeiculo}
      </h1> */}
      <div className="col-12 mb-4">
        <div className="card border-0 shadow-sm bg-light">
          <div className="card-body py-3">
            <Link
              href="/"
              passHref
              className="text-decoration-none d-inline-flex align-items-center gap-2"
              style={{
                color: '#2c246f',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <span className="material-icons fs-5">arrow_back_ios</span>
              <span className="fw-semibold fs-5">{texts.voltar}</span>
            </Link>
          </div>
        </div>
      </div>


      {id && <VehicleForm id={id} />}
    </Layout>
  );
}