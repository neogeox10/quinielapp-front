import { useEffect, useState } from 'react';
import { apiCall } from '../../api/client';
import { QuinielaModal } from './components/QuinielaModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ViewMatchesModal } from './components/ViewMatchesModal';
import { RankingModal } from '../player/components/RankingModal';
import { QuinielaUsuariosModal } from './components/QuinielaUsuariosModal';

export const QuinielasList = () => {
    const [quinielas, setQuinielas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para Modales
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showRanking, setShowRanking] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    // Referencias a la quiniela seleccionada
    const [selectedQuiniela, setSelectedQuiniela] = useState<any>(null);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const fetchQuinielas = async () => {
        try {
            const res = await apiCall({ method: 'GET', path: '/admin/quinielas' });
            setQuinielas(res.data);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchQuinielas(); }, []);

    const toggleStatus = async (quinielaId: string, currentStatus: boolean) => {
        try {
            await apiCall({
                method: 'PATCH',
                path: `/admin/quinielas/${quinielaId}/status`,
                body: { bloqueada: !currentStatus }
            });
            fetchQuinielas(); // Recargamos la lista
        } catch (error) {
            alert("No se pudo cambiar el estado");
        }
    };

    // Handlers para Edición/Creación
    const handleOpenCreate = () => {
        setSelectedQuiniela(null);
        setShowEditModal(true);
    };

    const handleOpenEdit = (q: any) => {
        setSelectedQuiniela(q);
        setShowEditModal(true);
    };

    // Handlers para Borrado
    const handleRequestDelete = (id: string) => {
        setIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;
        try {
            await apiCall({ method: 'DELETE', path: `/admin/quinielas/${idToDelete}` });
            fetchQuinielas();
            setShowDeleteModal(false);
            setIdToDelete(null);
        } catch (e) {
            alert("Error al eliminar");
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                <div>
                    <h2 className="fw-bold mb-0 text-white">Gestión de Quinielas</h2>
                    <p className="mb-0 text-white">Administra las jornadas y partidos disponibles</p>
                </div>
                <button className="btn btn-primary btn-lg d-flex align-items-center justify-content-center shadow" onClick={handleOpenCreate}>
                    <i className="bi bi-plus-circle-fill me-2"></i> Nueva Jornada
                </button>
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
                        No hay quinielas por el momento.
                    </div>
                ) : quinielas.map(q => (
                    <div key={q._id} className="col-12 col-md-6 col-lg-4">
                        <div className="card shadow-sm border-0 h-100 hover-card">
                            <div className="card-body p-4 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h5 className="card-title fw-bold mb-0">{q.nombre}</h5>
                                    <span className="badge bg-primary-subtle text-primary">
                                        {q.partidos.length} Partidos
                                    </span>
                                </div>

                                <div className="mt-auto pt-3 border-top">
                                    <div className="d-grid gap-2">
                                        {/* Botón VER - Azul (Info) */}
                                        <button
                                            className="btn btn-info text-white d-flex align-items-center justify-content-center py-2 shadow-sm"
                                            onClick={() => { setSelectedQuiniela(q); setShowViewModal(true); }}
                                        >
                                            <i className="bi bi-eye-fill me-2"></i> Ver Partidos&nbsp;&nbsp;&nbsp;&nbsp;
                                        </button>
                                        <button
                                            className="btn btn-success text-white d-flex align-items-center justify-content-center py-2 shadow-sm"
                                            onClick={() => { setSelectedQuiniela(q); setShowRanking(true); }}
                                        >
                                            <i className="bi bi-bar-chart-fill me-2"></i> Ver Resultados&nbsp;&nbsp;
                                        </button>

                                        <button
                                            className="btn btn-secondary text-white d-flex align-items-center justify-content-center py-2 shadow-sm"
                                            onClick={() => { setSelectedQuiniela(q); setShowUserModal(true); }}
                                        >
                                            <i className="bi bi-person-fill-add me-2"></i> Asignar Usuarios
                                        </button>

                                        {/* Botón EDITAR - Amarillo (Warning) */}
                                        <button
                                            className="btn btn-warning text-white d-flex align-items-center justify-content-center py-2 shadow-sm"
                                            onClick={() => handleOpenEdit(q)}
                                        >
                                            <i className="bi bi-pencil-square me-2"></i> Editar Datos&nbsp;&nbsp;&nbsp;&nbsp;
                                        </button>

                                        <button
                                            className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 shadow-sm"
                                            onClick={() => toggleStatus(q._id, q.bloqueada)}
                                        >
                                            {q.bloqueada && <><i className="bi bi-lock-fill me-2"></i> Desbloquear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>}
                                            {!q.bloqueada && <><i className="bi bi-unlock-fill me-2"></i> Bloquear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>}
                                        </button>

                                        {/* Botón ELIMINAR - Rojo (Danger) */}
                                        <button
                                            className="btn btn-danger d-flex align-items-center justify-content-center py-2 shadow-sm"
                                            onClick={() => handleRequestDelete(q._id)}
                                        >
                                            <i className="bi bi-trash3-fill me-2"></i> Borrar Jornada&nbsp;&nbsp;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Formulario (Crear/Editar) */}
            {showEditModal && (
                <QuinielaModal
                    onClose={() => setShowEditModal(false)}
                    onSave={fetchQuinielas}
                    initialData={selectedQuiniela}
                />
            )}

            {showViewModal && selectedQuiniela && (
                <ViewMatchesModal
                    quiniela={selectedQuiniela}
                    onClose={() => setShowViewModal(false)}
                />
            )}

            {showUserModal && selectedQuiniela && (
                <QuinielaUsuariosModal
                    quiniela={selectedQuiniela}
                    onClose={() => { setShowUserModal(false); fetchQuinielas() }}
                />
            )}

            {showRanking && selectedQuiniela && (
                <RankingModal
                    quiniela={selectedQuiniela}
                    onClose={() => setShowRanking(false)}
                />
            )}

            {/* Modal de Confirmación Estético */}
            {showDeleteModal && idToDelete && <ConfirmModal
                title="¿Eliminar Quiniela?"
                message="Esta acción borrará la jornada y todos los pronósticos asociados de los usuarios. No se puede deshacer."
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />}
        </div>
    );
};