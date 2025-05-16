import { useState } from 'react';
import { importVehiclesFromExcel, exportVehiclesToExcel } from '../services/excelImportService';
import * as XLSX from 'xlsx';


const ExcelImporter = ({ onImportComplete }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        // Limpar resultados anteriores
        setResult(null);
        setError(null);
    };

    const handleImport = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Por favor, selecione um arquivo Excel para importar.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const importResult = await importVehiclesFromExcel(file);
            setResult(importResult);

            // Notificar componente pai sobre importação concluída
            if (onImportComplete && typeof onImportComplete === 'function') {
                onImportComplete(importResult);
            }
        } catch (err) {
            setError(err.message || err);
            setResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleExport = async () => {
    //     setIsLoading(true);
    //     setError(null);

    //     try {
    //         const blob = await exportVehiclesToExcel();

    //         // Criar URL para download
    //         const url = window.URL.createObjectURL(blob);

    //         // Criar link temporário para download
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', `veiculos_rally_carbono_${new Date().toISOString().slice(0, 10)}.xlsx`);

    //         // Anexar ao documento, clicar e remover
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);

    //         // Liberar URL
    //         window.URL.revokeObjectURL(url);
    //     } catch (err) {
    //         setError(err.message || err);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const downloadTemplateFile = () => {
        // Criar um modelo de arquivo Excel para download
        const headers = ['Equipe', 'Veículo', 'Número', 'Piloto', 'País'];
        const sampleData = [
            ['Equipe Alpha', 'Rally Car A', '303', 'Pedro Oliveira', 'Brasil'],
            ['Equipe Bravo', 'Rally Car B', '304', 'Maria Santos', 'Portugal'],
            ['Equipe Charlie', 'Rally Car C', '305', 'Ana Costa', 'EUA'],
        ];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Modelo');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'modelo_importacao_veiculos.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="excel-importer p-4 bg-white rounded shadow-sm border">
            <h2 className="fs-5 fw-semibold mb-4">Importação de Veículos</h2>

            <div className="d-flex flex-column gap-4 mb-4">
                <div>
                    <label className="form-label mb-2 small fw-medium">Arquivo Excel</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="form-control form-control-sm"
                        disabled={isLoading}
                    />
                    <div className="form-text">Formatos aceitos: .xlsx, .xls, .csv</div>
                </div>

                <div className="d-flex  gap-2 align-items-center">
                    <button
                        onClick={handleImport}
                        disabled={!file || isLoading}
                        className="btn custom-btn"
                    >
                        {isLoading ? 'Importando...' : 'Importar Veículos'}
                    </button>

                    {/* <button
                        onClick={handleExport}
                        disabled={isLoading}
                        className="btn custom-btn"
                    >
                        Exportar Veículos
                    </button> */}

                    <button
                        onClick={downloadTemplateFile}
                        disabled={isLoading}
                        className="btn custom-btn-outline border-0"
                    >
                        Download Template
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger small mb-4">
                    <strong>Erro:</strong> {error}
                </div>
            )}

            {result && (
                <div className="alert alert-success small mb-4">
                    <h6 className="fw-semibold mb-1">Resultado da importação:</h6>
                    <p className="mb-0">Total de registros processados: {result.total}</p>
                    <p className="mb-0">Veículos importados com sucesso: {result.imported}</p>

                    {result.errors.length > 0 && (
                        <div className="mt-2">
                            <p className="fw-semibold mb-1">Erros ({result.errors.length}):</p>
                            <ul className="mb-0 ps-3">
                                {result.errors.map((err, index) => (
                                    <li key={index}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 p-3 bg-light border rounded">
                <h6 className="fw-semibold mb-2">Instruções:</h6>
                <ol className="ps-3 small mb-0">
                    <li>Prepare uma planilha Excel com as colunas: Veículo, Número, Equipe e Piloto</li>
                    <li>Clique em "Download Template" para baixar um modelo pronto para preenchimento</li>
                    <li>Após preencher a planilha, selecione o arquivo e clique em "Importar Veículos"</li>
                    {/* <li>Você pode exportar os veículos cadastrados clicando em "Exportar Veículos"</li> */}
                </ol>
            </div>
        </div>

    );
};

export default ExcelImporter;