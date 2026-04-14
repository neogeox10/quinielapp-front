import { useEffect, useState } from 'react';
import { apiCall } from '../api/client';
import { GuestRankingModal } from './GuestRankingModal';
import { useNavigate } from 'react-router-dom';
import { ViewMatchesModal } from './admin/components/ViewMatchesModal';

export const Quinielas = () => {
    const [quinielas, setQuinielas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiniela, setSelectedQuiniela] = useState<any>(null);
    const [showRanking, setShowRanking] = useState(false);
    const navigate = useNavigate();
    const [showViewModal, setShowViewModal] = useState(false);

    const usuario = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (usuario.rol === 'ADMIN') {
            navigate('/admin/users');
        }

        if (usuario.rol === 'PLAYER') {
            navigate('/player/quinielas');
        }
    }, [usuario]);

    const fetchQuinielasDisponibles = async () => {
        try {
            // Asumimos un endpoint para el jugador que trae solo las activas
            const res = await apiCall({ method: 'GET', path: '/guest/quinielas' });
            setQuinielas(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuinielasDisponibles(); }, []);


    return (
        <div className="container py-4">
            <div className="mb-5">
                <h2 className="fw-bold mb-0 text-white">Quinielas Disponibles</h2>
                <p className="mb-0 text-white">Listado de jornadas y partidos disponibles</p>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-3 text-white">Cargando quinielas...</p>
                    </div>
                ) : quinielas.length === 0 ? (
                    <div className="text-center py-5 text-white">
                        <i className="bi bi-calendar-x fs-1 d-block mb-3"></i>
                        No hay quinielas activas por el momento.
                    </div>
                ) : quinielas.map(q => (
                    <div key={q._id} className="col-12 col-md-6 col-lg-4">
                        <div className="card shadow-sm border-0 h-100 hover-card">
                            <div className="card-body p-4 d-flex flex-column text-center">
                                <div className="mb-3">
                                    <i className="bi bi-trophy-fill text-warning" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h5 className="card-title fw-bold mb-3">{q.nombre}</h5>
                                <p className="text-muted small mb-4">
                                    <i className="bi bi-controller me-2"></i>
                                    {q.partidos.length} Partidos para pronosticar
                                </p>

                                <div className="mt-auto">
                                    <button
                                        className="btn btn-info text-white w-100 py-2 fw-bold shadow-sm"
                                        onClick={() => { setSelectedQuiniela(q); setShowViewModal(true); }}
                                    >
                                        <i className="bi bi-clipboard-check-fill me-2"></i> Ver Partidos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </button>
                                    <button
                                        className="btn btn-success w-100 py-2 fw-bold shadow-sm mt-2"
                                        onClick={() => { setSelectedQuiniela(q); setShowRanking(true); }}
                                    >
                                        <i className="bi bi-bar-chart-fill me-2"></i> Tabla de posiciones
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showRanking && selectedQuiniela && (
                <GuestRankingModal
                    quiniela={selectedQuiniela}
                    onClose={() => setShowRanking(false)}
                />
            )}

            {showViewModal && selectedQuiniela && (
                <ViewMatchesModal
                    quiniela={selectedQuiniela}
                    onClose={() => setShowViewModal(false)}
                />
            )}
        </div>
    );
};