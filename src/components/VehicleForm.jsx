// src/components/VehicleForm.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useVehicles } from '../hooks/useVehicles';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useGeneralContext } from '../contexts/GeneralContext';
import HomeIcon from '@mui/icons-material/Home';


const VehicleForm = ({ id }) => {
  const router = useRouter();
  const {
    currentVehicle,
    loadVehicle,
    saveVehicle,
    loading,
    error
  } = useVehicles();
  const { texts } = useGeneralContext();

  const [formData, setFormData] = useState({
    team: '',
    pilot: '',
    country: '',
    number: '',
    vehicle: '',
    year: '',
    fuel: '',
    consumptionInRace: '',
    displacementConsumption: '',

    // deslocamento até o evento    
    origin: '',
    vehicleDisplacement: '',
    fuelDisplacement: '',
    yearVehicDispl: '',
  });

  const [validation, setValidation] = useState({
    vehicle: true,
    // number: true,
    team: true,
    pilot: true
  });

  const [saveStatus, setSaveStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showDisplacement, setShowDisplacement] = useState(false);

  // Carregar dados do veículo quando o ID mudar
  useEffect(() => {
    const fetchVehicle = async () => {
      if (id && id !== 'new') {
        const vehicle = await loadVehicle(parseInt(id));
        if (vehicle) {
          setFormData({
            team: vehicle.team || '',
            pilot: vehicle.pilot || '',
            country: vehicle.country || '',
            number: vehicle.number || '',
            vehicle: vehicle.vehicle || '',
            year: vehicle.year || '',
            fuel: vehicle.fuel || '',
            consumptionInRace: vehicle.consumptionInRace || '',
            displacementConsumption: vehicle.displacementConsumption || '',

            // deslocamento até o evento    
            origin: vehicle.origin || '',
            vehicleDisplacement: vehicle.vehicleDisplacement || '',
            fuelDisplacement: vehicle.fuelDisplacement || '',
            yearVehicDispl: vehicle.yearVehicDispl || '',
          });
        }
        if (vehicle && (vehicle.origin || vehicle.vehicleDisplacement || vehicle.fuelDisplacement || vehicle.yearVehicDispl)) {
          setShowDisplacement(true);
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
    if ([
      'name',
      // 'number',
      'team',
      'pilot'
    ].includes(name)) {
      setValidation(prev => ({ ...prev, [name]: value.trim() !== '' }));
    }
  };

  // Função para validar o formulário
  const validateForm = () => {
    const newValidation = {
      vehicle: formData.vehicle.trim() !== '',
      // number: formData.number.trim() !== '',
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

  const handleShowDisplacement = () => {
    handleChange({ target: { name: 'origin', value: '' } });
    handleChange({ target: { name: 'vehicleDisplacement', value: '' } });
    handleChange({ target: { name: 'fuelDisplacement', value: '' } });
    handleChange({ target: { name: 'yearVehicDispl', value: '' } });
    setShowDisplacement(!showDisplacement)
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
      <Card.Header className="custom-btn text-white">
        <h5 className="mb-0">
          {id && id !== 'new' ? texts.editarVeiculo : texts.novoVeiculo}
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

        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center text-muted fw-bold">
              <span className="material-icons me-2">sports_score</span>
              {texts.equipe}
            </Form.Label>
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
                {texts.obrigatorio}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center text-muted fw-bold">
              <span className="material-icons me-2">sports_motorsports</span>
              {texts.piloto}
            </Form.Label>
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
                {texts.obrigatorio}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center text-muted fw-bold">
              <span className="material-icons me-2">flag</span>
              {texts.pais}
            </Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center text-muted fw-bold">
              <span className="material-icons me-2">pin</span>
              {texts.numero}
            </Form.Label>
            <Form.Control
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
            // isInvalid={!validation.number}

            />
            {/* {!validation.number && (
              <Form.Control.Feedback type="invalid">
                {texts.obrigatorio}
              </Form.Control.Feedback>
            )} */}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center text-muted fw-bold">
              <span className="material-icons me-2">directions_car</span>
              {texts.veiculo}
            </Form.Label>
            <Form.Control
              type="text"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              isInvalid={!validation.vehicle}
              required
            />
            {!validation.vehicle && (
              <Form.Control.Feedback type="invalid">
                {texts.obrigatorio}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center text-muted fw-bold">
              <span className="material-icons me-2">calendar_today</span>
              {texts.ano}
            </Form.Label>
            <Form.Control
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
            // isInvalid={!validation.year}
            // required
            />
            {/* {!validation.ano && (
              <Form.Control.Feedback type="invalid">
                {texts.obrigatorio}
              </Form.Control.Feedback>
            )} */}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center text-muted fw-bold">
              <span className="material-icons me-2">local_gas_station</span>
              {texts.combustivel}
            </Form.Label>
            <Form.Control
              type="text"
              name="fuel"
              value={formData.fuel}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center text-muted fw-bold">
              <span className="material-icons me-2">speed</span>
              {texts.consumoEmProva}
            </Form.Label>
            <Form.Control
              type="text"
              name="consumptionInRace"
              value={formData.consumptionInRace}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-flex align-items-center text-muted fw-bold">
              <span className="material-icons me-2">map</span>
              {texts.consumoEmDeslocamento}
            </Form.Label>
            <Form.Control
              type="text"
              name="displacementConsumption"
              value={formData.displacementConsumption}
              onChange={handleChange}
            />
          </Form.Group>



          <div className={`col-12 d-flex justify-content-${showDisplacement ? 'end' : 'center'}`}>
            <Button
              variant={showDisplacement ? "outline-danger" : "outline-success"}
              className="my-3 btn-sm border-0"
              type="button"
              disabled={saving}
              onClick={() => handleShowDisplacement()}
            >
              {showDisplacement ? texts.removerDeslocamento : texts.adicionarDeslocamento}
            </Button>
          </div>

          {
            showDisplacement && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center text-muted fw-bold">
                    <span className="material-icons me-2">location_on</span>
                    {texts.localDeOrigem}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center text-muted fw-bold">
                    <span className="material-icons me-2">airport_shuttle</span>
                    {texts.veiculoDeslocamento}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="vehicleDisplacement"
                    value={formData.vehicleDisplacement}
                    onChange={handleChange}
                    placeholder={texts.veiculoDeslocamentoPlaceholder}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center text-muted fw-bold">
                    <span className="material-icons me-2">local_gas_station</span>
                    {texts.combustivelDeslocamento}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fuelDisplacement"
                    value={formData.fuelDisplacement}
                    onChange={handleChange}
                    placeholder={texts.combustivelDeslocamentoPlaceholder}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center text-muted fw-bold">
                    <span className="material-icons me-2">calendar_today</span>
                    {texts.anoVeiculoDeslocamento}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="yearVehicDispl"
                    value={formData.yearVehicDispl}
                    onChange={handleChange}
                    placeholder={texts.anoVeiculoDeslocamentoPlaceholder}
                  />
                </Form.Group>
              </>
            )
          }

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              {texts.cancelar}
            </Button>

            <Button
              variant="success"
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
              ) : texts.salvarDados}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default VehicleForm;