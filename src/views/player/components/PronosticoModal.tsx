import { useState, useEffect } from 'react';
import { SORTED_COUNTRIES } from '../../../constants/countries.constants';
import { apiCall } from '../../../api/client';

export const PronosticoModal = ({ quiniela, onClose }: any) => {
    // Estado para guardar las predicciones usando el ID del partido como llave
    const [predicciones, setPredicciones] = useState<Record<string, { local: number | '', visitante: number | '', fase: string }>>({});
    const [guardando, setGuardando] = useState(false);

    // Inicializar el estado con los partidos vacíos
    useEffect(() => {
        const estadoInicial: Record<string, { local: number | '', visitante: number | '', fase: string }> = {};
        quiniela.partidos.forEach((p: any) => {
            if (p.fase === quiniela.faseActual) {
                estadoInicial[p._id] = { local: '', visitante: '', fase: p.fase };
            }
        });
        setPredicciones(estadoInicial);
    }, [quiniela]);

    const getCountry = (fifa: string) => SORTED_COUNTRIES.find(c => c.fifa === fifa);

    const handleCambioMarcador = (partidoId: string, tipo: 'local' | 'visitante', valor: string) => {
        setPredicciones(prev => ({
            ...prev,
            [partidoId]: {
                ...prev[partidoId],
                [tipo]: valor === '' ? '' : Number(valor),
            }
        }));
    };

    const enviarPronosticos = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);

        // Transformar el objeto en un array para el backend
        const pronosticosArray = Object.entries(predicciones).map(([partidoId, marcador]) => ({
            partidoId,
            golesLocal: marcador.local,
            golesVisitante: marcador.visitante,
            fase: marcador.fase,
        }));

        try {
            await apiCall({
                method: 'POST',
                path: `/player/quinielas/${quiniela._id}/pronosticos`,
                body: { pronosticos: pronosticosArray }
            });
            //alert("¡Pronósticos guardados con éxito!");
            onClose();
        } catch (error) {
            //alert("Error al guardar los pronósticos");
        } finally {
            setGuardando(false);
        }
    };

    const esEditable = (fase: string) => fase === quiniela.faseActual;

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <form className="modal-content border-0 shadow-lg" onSubmit={enviarPronosticos}>
                    <div className="modal-header bg-primary text-white border-0">
                        <h5 className="modal-title fw-bold">
                            <i className="bi bi-controller me-2"></i>
                            {quiniela.nombre} {quiniela.faseActual !== 'NINGUNA' ? ` - ${quiniela.faseActual}` : ''}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-0 bg-light">
                        <ul className="list-group list-group-flush">
                            {quiniela.partidos.filter((p:any)=>p.fase === quiniela.faseActual).map((p: any) => {
                                const local = getCountry(p.local);
                                const visita = getCountry(p.visitante);
                                const pred = predicciones[p._id] || { local: '', visitante: '' };

                                return (
                                    <li key={p._id} className="list-group-item py-4">
                                        {/* Fecha del partido */}
                                        <div className="text-center mb-3">
                                                {(() => {
                                                    const meses = [
                                                        { long: 'Enero', short: 'ENE' },
                                                        { long: 'Febrero', short: 'FEB' },
                                                        { long: 'Marzo', short: 'MAR' },
                                                        { long: 'Abril', short: 'ABR' },
                                                        { long: 'Mayo', short: 'MAY' },
                                                        { long: 'Junio', short: 'JUN', },
                                                        { long: 'Julio', short: 'JUL', },
                                                        { long: 'Agosto', short: 'AGO' },
                                                        { long: 'Septiembre', short: 'SEP' },
                                                        { long: 'Octubre', short: 'OCT' },
                                                        { long: 'Noviembre', short: 'NOV' },
                                                        { long: 'Diciembre', short: 'DIC' }
                                                    ];
                                                    const fecha = new Date(p.fecha);
                                                    return <>{fecha.getUTCDate()} / {meses[fecha.getMonth()].short} / {fecha.getFullYear()}</>
                                                })()}
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center px-2 px-md-5">
                                            {/* Local */}
                                            <div className="text-center" style={{ flex: 1 }}>
                                                <img src={local?.bandera} width="45" className="rounded shadow-sm mb-2" alt={local?.nombreES} />
                                                <div className="small fw-bold text-uppercase">{local?.nombreES}</div>
                                            </div>

                                            {/* Inputs de Marcador */}
                                            <div className="d-flex align-items-center gap-2 px-3">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg text-center fw-bold shadow-sm"
                                                    style={{ width: '90px' }}
                                                    min="0"
                                                    value={pred.local}
                                                    onChange={e => handleCambioMarcador(p._id, 'local', e.target.value)}
                                                    required
                                                    disabled={!esEditable(p.fase)}
                                                />
                                                <span className="fw-bold text-muted">-</span>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg text-center fw-bold shadow-sm"
                                                    style={{ width: '90px' }}
                                                    min="0"
                                                    value={pred.visitante}
                                                    onChange={e => handleCambioMarcador(p._id, 'visitante', e.target.value)}
                                                    required
                                                    disabled={!esEditable(p.fase)}
                                                />
                                            </div>

                                            {/* Visitante */}
                                            <div className="text-center" style={{ flex: 1 }}>
                                                <img src={visita?.bandera} width="45" className="rounded shadow-sm mb-2" alt={visita?.nombreES} />
                                                <div className="small fw-bold text-uppercase">{visita?.nombreES}</div>
                                            </div>
                                        </div>
                                        {quiniela.faseActual !== 'NINGUNA' && <div className="text-center mb-3">
                                            <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3">
                                                {p.fase}
                                            </span>
                                        </div>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="modal-footer border-0 bg-white">
                        {/* Contenedor flex con gap para separación */}
                        <div className="d-flex w-100 gap-2">
                            <button
                                type="button"
                                className="btn btn-light py-2 flex-fill fw-bold"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary py-2 flex-fill fw-bold shadow-sm"
                                disabled={guardando}
                            >
                                {guardando ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>...</>
                                ) : (
                                    <><i className="bi bi-send-check-fill me-2"></i>Guardar</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};