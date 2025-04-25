// src/components/VehicleList.jsx
import React from 'react';
import { useRouter } from 'next/router';
import { Table, Button, Badge, Card, Spinner } from 'react-bootstrap';
import { useVehicles } from '../hooks/useVehicles';

const VehicleList = () => {
  const router = useRouter();
  const { searchResults, loading, error } = useVehicles();
  
  // Função para navegar para o formulário de edição
  const handleEditVehicle = (id) => {
    router.push(`/form/${id}`);
  };
  
  // Função para criar novo veículo
  const handleNewVehicle = () => {
    router.push('/form/new');
  };
  
  // Renderizar indicador de carregamento
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }
  
  // Renderizar mensagem quando não há veículos
  if (!searchResults || searchResults.length === 0) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <p className="mb-4">Nenhum veículo encontrado.</p>
          <Button 
            variant="primary" 
            onClick={handleNewVehicle}
          >
            Adicionar Novo Veículo
          </Button>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Veículos Registrados</h5>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleNewVehicle}
        >
          Novo Veículo
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Número</th>
                <th>Equipe</th>
                <th>Piloto</th>
                <th>Status</th>
                <th className="text-end">Ação</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((vehicle) => (
                <tr key={vehicle.id} onClick={() => handleEditVehicle(vehicle.id)} style={{ cursor: 'pointer' }}>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.number}</td>
                  <td>{vehicle.team}</td>
                  <td>{vehicle.pilot}</td>
                  <td>
                    {vehicle.synced ? (
                      <Badge bg="success">Sincronizado</Badge>
                    ) : (
                      <Badge bg="warning" text="dark">Pendente</Badge>
                    )}
                  </td>
                  <td className="text-end">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditVehicle(vehicle.id);
                      }}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default VehicleList;