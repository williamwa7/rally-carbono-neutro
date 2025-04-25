// src/pages/index.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Layout from '../src/components/Layout';
import VehicleList from '../src/components/VehicleList';
import SearchBar from '../src/components/SearchBar';
import SyncButton from '../src/components/SyncButton';
import ExportButton from '../src/components/ExportButton';

export default function Home() {
  return (
    <Layout title="Rally Carbono Neutro - Veículos">
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
        <h1 className="h3 mb-3 mb-md-0">Gerenciamento de Veículos</h1>
        
        <div className="d-flex gap-2">
          <ExportButton />
          <SyncButton />
        </div>
      </div>
      
      <SearchBar />
      
      <VehicleList />
    </Layout>
  );
}