import { useState, useEffect } from 'react';
import { apiCall } from '../../../api/client';
import { DetallePronosticos } from './DetallePronosticos';

export const RankingModal = ({ quiniela, onClose }: any) => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        apiCall({ method: 'GET', path: `/player/quinielas/${quiniela._id}/leaderboard` })
            .then(res => setLeaderboard(res.data));
    }, [quiniela]);

    // Si hay un usuario seleccionado, mostramos sus pronósticos en lugar de la tabla
    if (selectedUser) {
        return (
            <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.7)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <DetallePronosticos
                        usuario={selectedUser}
                        partidosOriginales={quiniela.partidos}
                        onBack={() => setSelectedUser(null)}
                    />;
                </div>
            </div>
        );
    }




    return (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">Posiciones: {quiniela.nombre}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-0">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Posición</th>
                                    <th>Nombre</th>
                                    <th className="text-center">Puntaje</th>
                                    <th className="text-center">Marcadores Exactos</th>
                                    <th className="text-center">Fecha Envío</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((item, index) => (
                                    <tr key={item.usuarioId} style={{verticalAlign:'middle'}}>
                                        <td className="ps-4 fw-bold">{index + 1}</td>
                                        <td className='text-center' >
                                            <button
                                                className="btn btn-link p-0 text-decoration-none fw-bold"
                                                onClick={() => setSelectedUser(item)}
                                            >
                                                {item.nombre}<br/>({item.correo.split('@')[0]})
                                            </button>
                                        </td>
                                        <td className="text-center fw-bold text-primary">{item.puntos}</td>
                                        <td className="text-center fw-bold text-primary">{item.exactos}</td>
                                        <td className="text-center fw-bold text-primary">{item.fechaEnvio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};