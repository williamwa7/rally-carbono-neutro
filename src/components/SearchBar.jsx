// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { Form, InputGroup, Button, Row, Col, Card, Accordion } from 'react-bootstrap';
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
    <div className='col-12 mb-4'>
      <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="0">
          <Accordion.Header className='text-center fw-bold'>
            <i className="me-2 bi bi-search fw-bold fs-4"></i>
            <span className='fs-4'>{texts.pesquisar}</span>
          </Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className='d-flex align-items-center gap-1 fw-bold'>
                      <span className="material-icons">sports_score</span>
                      {texts.equipe}
                    </Form.Label>
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
                    <Form.Label className='d-flex align-items-center gap-1 fw-bold'>
                      <span className="material-icons">sports_motorsports</span>
                      {texts.piloto}
                    </Form.Label>
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
                    <Form.Label className='d-flex align-items-center gap-1 fw-bold'>
                      <span className="material-icons">money</span>
                      {texts.numero}
                    </Form.Label>
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
                  size="sm"
                  variant="outline-secondary"
                  type="button"
                  onClick={handleClear}
                >
                  {texts.limpar}
                </Button>
                <Button
                  // variant="success" 
                  size="sm"
                  className='custom-btn d-flex align-items-center gap-1'
                  type="submit"
                >
                  <span className="material-icons fs-6">search</span>
                  {texts.buscar}
                </Button>
              </div>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default SearchBar;