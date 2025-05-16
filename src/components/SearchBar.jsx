// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { Form, InputGroup, Button, Row, Col, Card } from 'react-bootstrap';
import { useGeneralContext } from '../contexts/GeneralContext';
import { useVehicles } from '../hooks/useVehicles';

const SearchBar = () => {
  const { searchVehicles, clearSearch } = useVehicles();
  const { texts } = useGeneralContext();


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
                <Form.Label>{texts.equipe}</Form.Label>
                <Form.Control
                  type="text"
                  name="team"
                  value={searchCriteria.team}
                  onChange={handleChange}
                  placeholder={texts.buscarEquipe}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{texts.piloto}</Form.Label>
                <Form.Control
                  type="text"
                  name="pilot"
                  value={searchCriteria.pilot}
                  onChange={handleChange}
                  placeholder={texts.buscarPiloto}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>{texts.numero}</Form.Label>
                <Form.Control
                  type="text"
                  name="number"
                  value={searchCriteria.number}
                  onChange={handleChange}
                  placeholder={texts.buscarNumero}
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
              {texts.limpar}
            </Button>
            <Button
              // variant="success" 
              className='custom-btn'
              type="submit"
            >
              {texts.buscar}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SearchBar;