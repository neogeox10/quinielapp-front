import { SORTED_COUNTRIES } from '../../../constants/countries.constants';

export const DetallePronosticos = ({ usuario, partidosOriginales, onBack }: any) => {
    const getCountry = (fifa: string) => SORTED_COUNTRIES.find(c => c.fifa === fifa);

    return (
        <div className="modal-content border-0">
            <div className="modal-header bg-primary text-white">
                <button className="btn btn-link text-white p-0 me-3" onClick={onBack}>
                    <i className="bi bi-arrow-left fs-4"></i>
                </button>
                <h5 className="modal-title">Pronósticos de {usuario.nombre}</h5>
            </div>
            <div className="modal-body bg-light" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {partidosOriginales.map((p: any) => {
                    const local = getCountry(p.local);
                    const visita = getCountry(p.visitante);
                    // Buscamos la predicción que corresponde a este partido
                    const pred = usuario.pronosticos.find((pr: any) => pr.partidoId === p._id);
                    return (
                        <div key={p._id} className="card mb-2 shadow-sm border-0">
                            <div className="card-body py-2 d-flex justify-content-center align-items-center">
                                <div className="text-center" style={{ width: '35%' }}>
                                    <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Marcador <br/> {usuario.nombre}</small>
                                </div>
                            </div>
                            <div className="card-body py-2 d-flex justify-content-between align-items-center">
                                <div className="text-end" style={{ width: '35%' }}>
                                    <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>{local?.nombreES}</small>
                                    <img src={local?.bandera} width="30" className="border rounded shadow-sm" />
                                </div>
                                <div className="bg-dark text-white rounded px-3 py-1 fw-bold mx-2">
                                   {pred?.golesLocal} - {pred?.golesVisitante}
                                </div>
                                <div className="text-start" style={{ width: '35%' }}>
                                    <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>{visita?.nombreES}</small>
                                    <img src={visita?.bandera} width="30" className="border rounded shadow-sm" />
                                </div>
                            </div>
                            <div className="card-body py-2 d-flex justify-content-center align-items-center">
                                <div className="text-center" style={{ width: '35%' }}>
                                    <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Marcador real</small>
                                </div>
                            </div>
                            <div className="card-body py-2 d-flex justify-content-between align-items-center">
                                <div className="text-end" style={{ width: '35%' }}>
                                    <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>{local?.nombreES}</small>
                                    <img src={local?.bandera} width="30" className="border rounded shadow-sm" />
                                </div>
                                <div className="bg-dark text-white rounded px-3 py-1 fw-bold mx-2">
                                    {p?.resultadoLocal} - {p?.resultadoVisitante}
                                </div>
                                <div className="text-start" style={{ width: '35%' }}>
                                    <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>{visita?.nombreES}</small>
                                    <img src={visita?.bandera} width="30" className="border rounded shadow-sm" />
                                </div>
                            </div>
                            <div className="card-body py-2 d-flex justify-content-center align-items-center">
                                <div className="text-center" style={{ width: '35%' }}>
                                    <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Puntos obtenidos</small>
                                </div>
                            </div>
                            <div className="card-body py-2 d-flex justify-content-center align-items-center">
                                <div className="bg-primary-subtle text-primary rounded px-3 py-1 fw-bold mx-2">
                                    {pred?.puntos || 0}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="card mb-2 shadow-sm border-0">
                    <div className="card-body py-2 d-flex justify-content-center align-items-center">
                        <div className="text-center" style={{ width: '35%' }}>
                            <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Puntos totales</small>
                        </div>
                    </div>
                    <div className="card-body py-2 d-flex justify-content-center align-items-center">
                        <div className="bg-primary-subtle text-primary rounded px-3 py-1 fw-bold mx-2">
                            {usuario.puntos || 0}
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary w-100" onClick={onBack}>Volver al Ranking</button>
            </div>
        </div>
    );
};