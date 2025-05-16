// src/components/SyncButton.jsx
import React, { useState } from 'react';
import { Button, Spinner, Modal } from 'react-bootstrap';
import { useOfflineSync } from '../hooks/useOfflineSync';

const SyncButton = () => {
  const { isOnline, syncing, syncWithGoogleSheets } = useOfflineSync();
  const [showModal, setShowModal] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  
  // Função para iniciar sincronização
  const handleSync = async () => {
    const result = await syncWithGoogleSheets();
    setSyncResult(result);
    setShowModal(true);
  };
  
  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSyncResult(null);
  };
  
  return (
    <>
      <Button
        variant={isOnline ? "success" : "secondary"}
        disabled={!isOnline || syncing}
        onClick={handleSync}
        className="d-flex align-items-center"
      >
        {syncing ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Sincronizando...
          </>
        ) : (
          <>
            <i className={`bi bi-cloud-upload me-2 ${isOnline ? '' : 'text-muted'}`}></i>
            Sincronizar com Google Sheets
          </>
        )}
      </Button>
      
      {/* Modal de resultado da sincronização */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {syncResult && syncResult.success 
              ? "Sincronização Concluída" 
              : "Erro na Sincronização"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {syncResult && syncResult.message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SyncButton;