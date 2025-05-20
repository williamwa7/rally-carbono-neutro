// src/pages/index.js
import React from 'react';
import { Row, Col, Spinner, Nav } from 'react-bootstrap';
import Layout from '../src/components/Layout';
import VehicleList from '../src/components/VehicleList';
import SearchBar from '../src/components/SearchBar';
import SyncButton from '../src/components/SyncButton';
import ExportButton from '../src/components/ExportButton';
import Accordion from 'react-bootstrap/Accordion';
import { useGeneralContext } from '@/src/contexts/GeneralContext';
import ExcelImporter from '@/src/components/ExcelImporter';
import { useDatabase } from '@/src/contexts/DatabaseContext';
import Link from 'next/link';


export default function Home() {
  const { texts } = useGeneralContext();
  const { isLoading } = useDatabase();


  return (
    <Layout title="Rally Carbono Neutro - Veículos">
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* <h1 className="h3 mb-3 mb-md-0">Gerenciamento de Veículos</h1> */}

        <div className="d-flex col-10 col-md-1 align-items-center justify-content-between">
          <img src="/fau_color.png" alt="" width={120} className="me-2" />
          <div className='d-lg-none'>
            <ExportButton />
          </div>
        </div>
        <div className="d-none d-lg-flex gap-3">
          <div className="d-flex align-items-center">
            <ExportButton />
            {/* <SyncButton /> */}
          </div>
          <Link href="/vehicleManagement" passHref legacyBehavior className=''>
            <button className="btn btn-sm custom-btn">
              {/* icone de carro */}
              <i className="me-2 bi bi-car-front"></i>
              Gerenciar Veículos
            </button>
          </Link>
        </div>

      </div>
      <div className="row mb-4">
        {/* <p className='fs-3 text-center text-muted opacity-75 lead mt-4 mt-md-0'>Coleta de dados Rally Carbono Neutro {new Date().getFullYear()}</p> */}
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="0">
            <Accordion.Header className='text-center fw-bold'>
              {/* icone info */}
              <i className="me-2 bi bi-info-circle"></i>
              <small className='fw-bold'>{texts.tituloEvento}</small></Accordion.Header>
            <Accordion.Body>
              <div className='d-flex flex-column flex-md-row justify-content-center gap-4 mb-3 align-items-center'>
                <img src="/selo_verde_nw.png" alt="" width={150} />
                <p className='fs-5 fw-bold text-success'>{texts.descricaoEvento}</p>
              </div>
              <hr />
              <div className='px-0 px-md-5 '>
                <p className='fs-5 text-secondary'>{texts.descricaoEvento2}</p>
                <p className='fs-5 text-dark'>{texts.descricaoEvento3}</p>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <SearchBar />
      {
        isLoading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        ) : (

          <VehicleList />
        )
      }
    </Layout>
  );
}