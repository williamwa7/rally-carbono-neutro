// src/components/VehicleList.jsx
import React from 'react';
import { useRouter } from 'next/router';
import { Table, Button, Badge, Card, Spinner } from 'react-bootstrap';
import { useVehicles } from '../hooks/useVehicles';
import { useGeneralContext } from '../contexts/GeneralContext';
import { useDatabase } from '../contexts/DatabaseContext';

const VehicleList = () => {
  const router = useRouter();
  const { searchResults, loading, error } = useVehicles();
  const { isLoading } = useDatabase();
  const { texts } = useGeneralContext();


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
          <p className="mb-4">{texts.veiculoNaoEncontrado}</p>
          <Button
            // variant="success"
            onClick={handleNewVehicle}
            className="custom-btn"
          >
            {texts.novoVeiculo}
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{texts.veiculosRegistrados}</h5>
        <Button
          // variant="success"
          size="sm"
          onClick={handleNewVehicle}
          className="custom-btn"
        >
          {texts.novoVeiculo}
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        {isLoading ?
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
          :
          <div className="table-responsive">
            <Table hover className="mb-0">

              <thead>
                <tr>
                  <th>{texts.equipe}</th>
                  <th>{texts.veiculo}</th>
                  {/* <th>{texts.numero}</th> */}
                  <th>{texts.piloto}</th>
                  {/* <th>{texts.pais}</th> */}
                  {/* <th>Status</th> */}
                  {/* <th className="text-end"> </th> */}
                  <th className="text-center"><span className="material-icons">fact_check</span></th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((vehicle) => (
                  <tr key={vehicle.id} onClick={() => handleEditVehicle(vehicle.id)} style={{ cursor: 'pointer' }}>
                    <td>{vehicle.team}</td>
                    <td>{<>{vehicle.number ? <><b className='badge bg-dark text-warning'>{`${vehicle.number} `}</b> | </> : ''} {vehicle.vehicle}</>}</td>
                    {/* <td>{vehicle.number}</td> */}
                    <td>{vehicle.pilot}</td>
                    {/* <td>{vehicle.country}</td> */}
                    {/* <td>
                    {vehicle.synced ? (
                      <Badge bg="success">Sincronizado</Badge>
                    ) : (
                      <Badge bg="warning" text="dark">Pendente</Badge>
                    )}
                  </td> */}
                    {/* <td className="text-end">
                      <Button
                        // variant="outline-success"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVehicle(vehicle.id);
                        }}
                        className="custom-btn-outline"
                      >
                        {texts.editar}
                      </Button>
                    </td> */}
                    <td className="text-center">
                      {
                        vehicle.year ||
                          vehicle.fuel ||
                          vehicle.displacementConsumption ||
                          vehicle.consumptionInRace ||
                          vehicle.origin ||
                          vehicle.vehicleDisplacement ||
                          vehicle.fuelDisplacement ||
                          vehicle.yearVehicDispl
                          ? (
                            <span className="badge bg-success px-2 text-white material-icons" style={{ width: '28px', fontSize: '12px' }}>check</span>
                          ) : (
                            <span className="badge bg-warning text-dark px-2 material-icons" style={{ width: '28px', fontSize: '12px' }}>schedule</span>
                          )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        }
      </Card.Body>
    </Card>
  );
};

export default VehicleList;