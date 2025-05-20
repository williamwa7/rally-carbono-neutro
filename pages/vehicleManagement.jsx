// src/pages/VehicleManagement.jsx

import Layout from '@/src/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import ExcelImporter from '../src/components/ExcelImporter';
import { getAllVehicles, deleteVehicle, clearAllVehicles } from '../src/db/indexedDB';

const VehicleManagement = () => {
    const router = useRouter();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Carregar veículos ao montar o componente ou quando houver atualizações
    useEffect(() => {
        const loadVehicles = async () => {
            try {
                setLoading(true);
                const vehicleData = await getAllVehicles();
                setVehicles(vehicleData);
                setError(null);
            } catch (err) {
                setError(`Erro ao carregar veículos: ${err.message || err}`);
            } finally {
                setLoading(false);
            }
        };

        loadVehicles();
    }, [refreshTrigger]);

    // Função para recarregar os veículos
    const refreshVehicles = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Função para lidar com a exclusão de um veículo
    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
            try {
                await deleteVehicle(id);
                refreshVehicles();
            } catch (err) {
                setError(`Erro ao excluir veículo: ${err.message || err}`);
            }
        }
    };

    // Função para limpar todos os veículos
    const handleClearAll = async () => {
        if (window.confirm('ATENÇÃO: Tem certeza que deseja excluir TODOS os veículos? Esta ação não pode ser desfeita.')) {
            try {
                await clearAllVehicles();
                refreshVehicles();
            } catch (err) {
                setError(`Erro ao limpar veículos: ${err.message || err}`);
            }
        }
    };

    // Função chamada quando a importação é concluída
    const handleImportComplete = () => {
        refreshVehicles();
    };

    const handleEditVehicle = (id) => {
        router.push(`/form/${id}`);
    };

    return (

        <Layout title="Gerenciamento de Veículos">
            {/* <h1 className="h3 mb-4 text-center">{texts.addNovoVeiculo}</h1> */}

            <div className="container p-0">
                <Link href="/" passHref legacyBehavior className=' btn btn-outline-light'>
                    <Nav.Link className="text-muted fw-bold fs-5 opacity-75">
                        {"< Voltar"}
                    </Nav.Link>
                </Link>
                <h3 className="mb-4 text-center">Gerenciamento de Veículos</h3>

                <div className="row g-4">
                    {/* Seção de importação */}
                    <div className="col-lg-4">
                        <ExcelImporter onImportComplete={handleImportComplete} />
                    </div>

                    {/* Lista de veículos */}
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="h5 mb-0">Veículos Cadastrados</h2>

                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={refreshVehicles}
                                            className="btn btn-primary"
                                        >
                                            Atualizar
                                        </button>
                                        <button
                                            onClick={handleClearAll}
                                            className="btn btn-danger"
                                            disabled={vehicles.length === 0}
                                        >
                                            Excluir Todos
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                {loading ? (
                                    <div className="d-flex justify-content-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Carregando...</span>
                                        </div>
                                    </div>
                                ) : vehicles.length === 0 ? (
                                    <div className="bg-light p-4 text-center rounded">
                                        <p className="text-muted mb-1">Nenhum veículo cadastrado</p>
                                        <p className="text-secondary small mb-0">Use o formulário de importação para adicionar veículos</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover table-bordered align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Veículo</th>
                                                    {/* <th>Nº</th> */}
                                                    <th>Equipe</th>
                                                    <th>Piloto</th>
                                                    <th className="text-center"><span className="material-icons">fact_check</span></th>
                                                    {/* <th>Sincronizado</th> */}
                                                    <th className=" text-center" style={{ width: '40px' }}>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vehicles.map((vehicle) => (
                                                    <tr key={vehicle.id}>
                                                        <td>{vehicle.number} - {vehicle.vehicle}</td>
                                                        {/* <td>{vehicle.number}</td> */}
                                                        <td>{vehicle.team}</td>
                                                        <td>{vehicle.pilot}</td>
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
                                                                        <span className="badge bg-success px-2 text-white material-icons">check</span>
                                                                    ) : (
                                                                        <span className="badge bg-warning text-dark px-2 material-icons">schedule</span>
                                                                    )}

                                                        </td>
                                                        {/* <td>
                                                            {vehicle.synced ? (
                                                                <span className="badge bg-success">Sim</span>
                                                            ) : (
                                                                <span className="badge bg-warning text-dark">Não</span>
                                                            )}
                                                        </td> */}
                                                        <td className="text-center" style={{ width: "40px" }}>
                                                            <small
                                                                onClick={() => handleEditVehicle(vehicle.id)}
                                                                className="btn btn-sm btn-link text-primary"
                                                            >
                                                                <span className="material-icons">edit_square</span>
                                                            </small>
                                                            <small
                                                                onClick={() => handleDelete(vehicle.id)}
                                                                className="btn btn-sm btn-link text-danger fs-6"
                                                            >
                                                                <span className="material-icons">delete</span>
                                                            </small>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {vehicles.length > 0 && (
                                    <div className="mt-3 text-end text-muted small">
                                        Total: {vehicles.length} veículos
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default VehicleManagement;