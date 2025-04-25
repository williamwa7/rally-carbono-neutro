// src/components/ExportButton.jsx
import React, { useState } from 'react';
import { Button, Spinner, Modal } from 'react-bootstrap';
import { useOfflineSync } from '../hooks/useOfflineSync';

const ExportButton = () => {
  const { exporting, exportToExcel } = useOfflineSync();
  const [showModal, setShowModal] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  
  // Função para iniciar exportação
  const handleExport = async () => {
    const result = await exportToExcel();
    setExportResult(result);
    setShowModal(true);
  };
  
  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setExportResult(null);
  };
  
  return (
    <>
      <Button
        variant="outline-primary"
        disabled={exporting}
        onClick={handleExport}
        className="d-flex align-items-center"
      >
        {exporting ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Exportando...
          </>
        ) : (
          <>
            <i className="bi bi-file-earmark-excel me-2"></i>
            Exportar para Excel
          </>
        )}
      </Button>
      
      {/* Modal de resultado da exportação */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {exportResult && exportResult.success 
              ? "Exportação Concluída" 
              : "Erro na Exportação"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {exportResult && exportResult.success 
            ? `Arquivo "${exportResult.filename}" baixado com sucesso.`
            : exportResult && exportResult.message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExportButton;