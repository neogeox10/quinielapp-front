import { useState, useEffect } from 'react';
import { DetallePronosticos } from './player/components/DetallePronosticos';
import { apiCall } from '../api/client';

export const GuestRankingModal = ({ quiniela, onClose }: any) => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        apiCall({ method: 'GET', path: `/guest/quinielas/${quiniela._id}/leaderboard` })
            .then(res => setLeaderboard(res.data));
    }, [quiniela]);

    const getMedal = (index: number) => {
        if (index === 0) return <i className="bi bi-trophy-fill text-warning me-2"></i>;
        if (index === 1) return <i className="bi bi-award-fill text-secondary me-2"></i>;
        if (index === 2) return <i className="bi bi-award-fill text-danger-emphasis me-2"></i>;
        return null;
    };

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
                                    <th className="ps-4">Pos</th>
                                    <th>Nombre</th>
                                    <th className="text-center">Puntaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((item, index) => (
                                    <tr key={item.usuarioId}>
                                        <td className="ps-4 fw-bold">{index + 1}</td>
                                        <td>
                                            {getMedal(index)}
                                            <button
                                                className="btn btn-link p-0 text-decoration-none fw-bold"
                                                onClick={() => setSelectedUser(item)}
                                            >
                                                {item.nombre}<br/>({item.correo})
                                            </button>
                                        </td>
                                        <td className="text-center fw-bold text-primary">{item.puntos}</td>
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