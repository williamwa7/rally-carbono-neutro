// src/pages/form/new.js (continuação)
import { useGeneralContext } from '@/src/contexts/GeneralContext';
import Link from 'next/link';
import React from 'react';
import Layout from '../../src/components/Layout';
import VehicleForm from '../../src/components/VehicleForm';

export default function NewVehiclePage() {
  const { texts } = useGeneralContext();

  return (
    <Layout title="Novo Veículo">
      {/* <h1 className="h3 mb-4 text-center">{texts.addNovoVeiculo}</h1> */}
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

      <VehicleForm id="new" />
    </Layout>
  );
}