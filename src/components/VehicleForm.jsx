// src/components/VehicleForm.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useVehicles } from '../hooks/useVehicles';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

const VehicleForm = ({ id }) => {
  const router = useRouter();
  const { 
    currentVehicle, 
    loadVehicle, 
    saveVehicle, 
    loading, 
    error 
  } = useVehicles();
  
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    team: '',
    pilot: '',
    fuel: '',
    origin: ''
  });
  
  const [validation, setValidation] = useState({
    name: true,
    number: true,
    team: true,
    pilot: true
  });
  
  const [saveStatus, setSaveStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Carregar dados do veículo quando o ID mudar
  useEffect(() => {
    const fetchVehicle = async () => {
      if (id && id !== 'new') {
        const vehicle = await loadVehicle(parseInt(id));
        if (vehicle) {
          setFormData({
            name: vehicle.name || '',
            number: vehicle.number || '',
            team: vehicle.team || '',
            pilot: vehicle.pilot || '',
            fuel: vehicle.fuel || '',
            origin: vehicle.origin || ''
          });
        }
      }
    };
    
    fetchVehicle();
  }, [id, loadVehicle]);
  
  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar campo obrigatório
    if (['name', 'number', 'team', 'pilot'].includes(name)) {
      setValidation(prev => ({ ...prev, [name]: value.trim() !== '' }));
    }
  };
  
  // Função para validar o formulário
  const validateForm = () => {
    const newValidation = {
      name: formData.name.trim() !== '',
      number: formData.number.trim() !== '',
      team: formData.team.trim() !== '',
      pilot: formData.pilot.trim() !== ''
    };
    
    setValidation(newValidation);
    
    return Object.values(newValidation).every(valid => valid);
  };
  
  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSaveStatus({
        success: false,
        message: 'Por favor, preencha todos os campos obrigatórios.'
      });
      return;
    }
    
    try {
      setSaving(true);
      const vehicleId = id && id !== 'new' ? parseInt(id) : null;
      const savedVehicle = await saveVehicle(formData, vehicleId);
      
      if (savedVehicle) {
        setSaveStatus({
          success: true,
          message: 'Veículo salvo com sucesso.'
        });
        
        // Redirecionar para a lista após salvar
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error) {
      setSaveStatus({
        success: false,
        message: `Erro ao salvar: ${error.message}`
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Função para cancelar e voltar à lista
  const handleCancel = () => {
    router.push('/');
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }
  
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          {id && id !== 'new' ? 'Editar Veículo' : 'Novo Veículo'}
        </h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger">{error}</Alert>
        )}
        
        {saveStatus && (
          <Alert variant={saveStatus.success ? 'success' : 'danger'}>
            {saveStatus.message}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome do Veículo *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!validation.name}
              required
            />
            {!validation.name && (
              <Form.Control.Feedback type="invalid">
                Nome do veículo é obrigatório
              </Form.Control.Feedback>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Número do Veículo *</Form.Label>
            <Form.Control
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              isInvalid={!validation.number}
              required
            />
            {!validation.number && (
              <Form.Control.Feedback type="invalid">
                Número do veículo é obrigatório
              </Form.Control.Feedback>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Equipe *</Form.Label>
            <Form.Control
              type="text"
              name="team"
              value={formData.team}
              onChange={handleChange}
              isInvalid={!validation.team}
              required
            />
            {!validation.team && (
              <Form.Control.Feedback type="invalid">
                Nome da equipe é obrigatório
              </Form.Control.Feedback>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Piloto *</Form.Label>
            <Form.Control
              type="text"
              name="pilot"
              value={formData.pilot}
              onChange={handleChange}
              isInvalid={!validation.pilot}
              required
            />
            {!validation.pilot && (
              <Form.Control.Feedback type="invalid">
                Nome do piloto é obrigatório
              </Form.Control.Feedback>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Combustível</Form.Label>
            <Form.Control
              type="text"
              name="fuel"
              value={formData.fuel}
              onChange={handleChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Local de Origem</Form.Label>
            <Form.Control
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant="secondary" 
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </Button>
            
            <Button 
              variant="primary" 
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Salvando...
                </>
              ) : 'Salvar Veículo'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default VehicleForm;