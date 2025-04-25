// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { Form, InputGroup, Button, Row, Col, Card } from 'react-bootstrap';
import { useVehicles } from '../hooks/useVehicles';

const SearchBar = () => {
  const { searchVehicles, clearSearch } = useVehicles();
  
  const [searchCriteria, setSearchCriteria] = useState({
    team: '',
    pilot: '',
    number: ''
  });
  
  // Função para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({ ...prev, [name]: value }));
  };
  
  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    searchVehicles(searchCriteria);
  };
  
  // Função para limpar a busca
  const handleClear = () => {
    setSearchCriteria({
      team: '',
      pilot: '',
      number: ''
    });
    clearSearch();
  };
  
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Equipe</Form.Label>
                <Form.Control
                  type="text"
                  name="team"
                  value={searchCriteria.team}
                  onChange={handleChange}
                  placeholder="Buscar por equipe"
                />
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label>Piloto</Form.Label>
                <Form.Control
                  type="text"
                  name="pilot"
                  value={searchCriteria.pilot}
                  onChange={handleChange}
                  placeholder="Buscar por piloto"
                />
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label>Número do Carro</Form.Label>
                <Form.Control
                  type="text"
                  name="number"
                  value={searchCriteria.number}
                  onChange={handleChange}
                  placeholder="Buscar por número"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button 
              variant="outline-secondary" 
              type="button"
              onClick={handleClear}
            >
              Limpar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
            >
              Buscar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SearchBar;