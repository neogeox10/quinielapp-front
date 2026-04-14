import { useEffect, useState } from 'react';
import { apiCall } from '../../api/client';
import { PronosticoModal } from './components/PronosticoModal';
import { RankingModal } from './components/RankingModal';
import { Modal } from 'bootstrap';
import { ViewMatchesModal } from '../admin/components/ViewMatchesModal';

export const PlayerQuinielas = () => {
    const usuario = JSON.parse(localStorage.getItem('user') || '{}');
    const [quinielas, setQuinielas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiniela, setSelectedQuiniela] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [showRanking, setShowRanking] = useState(false);
    const [terminosAceptados, setTerminosAceptados] = useState(false);
    const [error, setError] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);

    const fetchQuinielasDisponibles = async () => {
        try {
            // Asumimos un endpoint para el jugador que trae solo las activas
            const [res, resTerminos] = await Promise.all([
                apiCall({ method: 'GET', path: '/player/quinielas' }),
                apiCall({ method: 'GET', path: '/player/terminos' }),
            ]);
            setQuinielas(res.data);
            setTerminosAceptados(resTerminos.data.terminosAceptados);
            if (!resTerminos.data.terminosAceptados) {
                setTimeout(() => {
                    const modalEl = document.getElementById('privacyModal');
                    if (modalEl) {
                        const modalInstance = Modal.getOrCreateInstance(modalEl);
                        modalInstance.show();
                    }
                }, 150);
            }
        } catch (e) {
            setError(true);
            setMensaje('Error al consultar información.')
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuinielasDisponibles(); }, []);

    const handleJugar = (q: any) => {
        setSelectedQuiniela(q);
        setShowModal(true);
    };

    return (
        <div className="container py-4">
            <div className="mb-5">
                <h2 className="fw-bold mb-0 text-white">Quinielas Disponibles</h2>
                <p className="mb-0 text-white">Selecciona una jornada y pon a prueba tus conocimientos</p>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                )
                    : error ? (
                        <div className="alert alert-danger d-flex align-items-center text-danger" role="alert">
                            <i className="bi bi-exclamation-octagon-fill me-2"></i>{mensaje}
                        </div>
                    )
                        : quinielas.length === 0 ? (
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
                                        {!q.yaJugada && q.usuarios.includes(usuario.id) &&
                                            <p className="text-muted small mb-4">
                                                <i className="bi bi-controller me-2"></i>
                                                {q.partidos.filter((p: any) => p.fase === q.faseActual).length} {q.partidos.filter((p: any) => p.fase === q.faseActual).length === 1 ? 'Partido' : 'Partidos'} para pronosticar
                                            </p>
                                        }

                                        {!q.yaJugada && !q.usuarios.includes(usuario.id) &&
                                            <p className="text-muted small mb-4">
                                                <i className="bi bi-emoji-frown me-2"></i>
                                                No estas participando en esta Quiniela
                                            </p>
                                        }

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
                                            {!q.yaJugada && !q.bloqueada && q.usuarios.includes(usuario.id) &&
                                                <button
                                                    className="btn btn-primary w-100 py-2 fw-bold shadow-sm mt-2"
                                                    onClick={() => handleJugar(q)}
                                                    disabled={!terminosAceptados}
                                                >
                                                    <i className="bi bi-pencil-square me-2"></i>
                                                    Ingresar Pronósticos
                                                </button>
                                            }
                                            {!q.yaJugada && q.bloqueada && q.usuarios.includes(usuario.id) &&
                                                <button
                                                    className="btn btn-primary w-100 py-2 fw-bold shadow-sm mt-2"
                                                    onClick={() => { }}
                                                    disabled={true}
                                                >
                                                    <i className="bi bi-lock-fill me-2"></i>
                                                    Tiempo Agotado
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
            </div>

            {
                showModal && selectedQuiniela && (
                    <PronosticoModal
                        quiniela={selectedQuiniela}
                        onClose={() => {
                            setShowModal(false);
                            fetchQuinielasDisponibles();
                        }}
                    />
                )
            }

            {
                showRanking && selectedQuiniela && (
                    <RankingModal
                        quiniela={selectedQuiniela}
                        onClose={() => setShowRanking(false)}
                    />
                )
            }

            {showViewModal && selectedQuiniela && (
                <ViewMatchesModal
                    quiniela={selectedQuiniela}
                    onClose={() => setShowViewModal(false)}
                />
            )}
        </div >
    );
};