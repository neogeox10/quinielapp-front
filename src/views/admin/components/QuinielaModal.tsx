import { useState } from 'react';
import { SORTED_COUNTRIES } from '../../../constants/countries.constants';
import { apiCall } from '../../../api/client';

export const QuinielaModal = ({ onClose, onSave, initialData }: any) => {
    const [nombre, setNombre] = useState(initialData?.nombre || '');
    const [faseActual, setFaseActual] = useState(initialData?.faseActual || 'NINGUNA');
    const [partidos, setPartidos] = useState<any[]>(initialData?.partidos || [{ local: '', visitante: '', fecha: '' }]);

    const obtenerBandera = (fifa: string) => SORTED_COUNTRIES.find(c => c.fifa === fifa)?.bandera;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = initialData ? 'PUT' : 'POST';
        const path = initialData ? `/admin/quinielas/${initialData._id}` : '/admin/quinielas';

        try {
            await apiCall({ method, path, body: { nombre, faseActual, partidos } });
            onSave();
            onClose();
        } catch (e) { alert("Error al guardar"); }
    };

    return (
        <div className="modal show d-block shadow-lg" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0">
                    <div className="modal-header border-0 bg-light">
                        <h5 className="modal-title fw-bold">
                            <i className={`bi bi-${initialData ? 'pencil' : 'plus-circle'} me-2`}></i>
                            {initialData ? 'Editar Quiniela' : 'Crear Quiniela'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit} className="modal-body p-4">
                        <div className="mb-4">
                            <label className="form-label fw-bold">Nombre de la Jornada</label>
                            <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">Fase Actual</label>
                            <select className='form-select' value={faseActual} onChange={e => setFaseActual(e.target.value)}>
                                <option value='NINGUNA' selected>N/A</option>
                                <option value='16vos'>16vos</option>
                                <option value='8vos'>8vos</option>
                                <option value='4tos'>4tos</option>
                                <option value='semi'>Semifinal</option>
                                <option value='final'>Final</option>
                            </select>
                        </div>

                        <div className="row g-3">
                            {partidos.map((p, i) => (
                                <div key={i} className="col-12 col-md-6">
                                    <div className="card bg-light border-0">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between mb-2">
                                                <small className="text-muted fw-bold">Partido {i + 1}</small>
                                                <button type="button" className="btn-close small" onClick={() => setPartidos(partidos.filter((_, idx) => idx !== i))}></button>
                                            </div>
                                            <div className="row g-2 align-items-end">

                                                {/* Selector de paises */}
                                                <div className="col-6 text-center">
                                                    <img src={obtenerBandera(p.local) || 'https://placehold.co/50x30?text=?'} className="mb-2 rounded shadow-sm" style={{ width: 50, height: 30, objectFit: 'cover' }} />
                                                    <select className="form-select form-select-sm" value={p.local} onChange={e => {
                                                        const n = [...partidos]; n[i].local = e.target.value; setPartidos(n);
                                                    }} required>
                                                        <option value="">Local</option>
                                                        {SORTED_COUNTRIES.map(c => <option key={c.fifa} value={c.fifa}>{c.nombreES}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-6 text-center">
                                                    <img src={obtenerBandera(p.visitante) || 'https://placehold.co/50x30?text=?'} className="mb-2 rounded shadow-sm" style={{ width: 50, height: 30, objectFit: 'cover' }} />
                                                    <select className="form-select form-select-sm" value={p.visitante} onChange={e => {
                                                        const n = [...partidos]; n[i].visitante = e.target.value; setPartidos(n);
                                                    }} required>
                                                        <option value="">Visita</option>
                                                        {SORTED_COUNTRIES.map(c => <option key={c.fifa} value={c.fifa}>{c.nombreES}</option>)}
                                                    </select>
                                                </div>

                                                {/* Marcador */}
                                                {initialData && (
                                                    <>
                                                        <div className="col-12 text-center">
                                                            <small className="text-muted fw-bold">Marcador</small>
                                                        </div>
                                                        <div className="col-6 text-end">
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm text-center w-100"
                                                                value={p.resultadoLocal ?? ''}
                                                                onChange={e => {
                                                                    const n = [...partidos];
                                                                    n[i].resultadoLocal = e.target.value === '' ? null : Number(e.target.value);
                                                                    setPartidos(n);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-6 text-center">
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm text-center w-100"
                                                                value={p.resultadoVisitante ?? ''}
                                                                onChange={e => {
                                                                    const n = [...partidos];
                                                                    n[i].resultadoVisitante = e.target.value === '' ? null : Number(e.target.value);
                                                                    setPartidos(n);
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                )}

                                                {/* Fecha */}
                                                <div className="col-12 mt-2">
                                                    <input type="datetime-local" className="form-control form-control-sm" value={p.fecha ? p.fecha.substring(0, 16) : ''} onChange={e => {
                                                        const n = [...partidos]; n[i].fecha = e.target.value; setPartidos(n);
                                                    }} required />
                                                </div>
                                                <div className="col-12 mt-2 small">
                                                    <label className="form-label fw-bold">Fase</label>
                                                    <select className='form-select form-select-sm' value={faseActual === 'NINGUNA' ? faseActual : p.fase} onChange={e => {
                                                        const n = [...partidos]; n[i].fase = e.target.value; setPartidos(n);
                                                    }} disabled={faseActual === 'NINGUNA'}>
                                                        <option value='NINGUNA' selected>N/A</option>
                                                        <option value='16vos'>16vos</option>
                                                        <option value='8vos'>8vos</option>
                                                        <option value='4tos'>4tos</option>
                                                        <option value='semi'>Semifinal</option>
                                                        <option value='final'>Final</option>
                                                    </select>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn btn-outline-primary btn-sm mt-3 w-100" onClick={() => setPartidos([...partidos, { local: '', visitante: '', fecha: '' }])}>
                            <i className="bi bi-plus-circle me-1"></i> Añadir Partido
                        </button>
                    </form>
                    <div className="modal-footer border-0">
                        <button type="button" className="btn btn-link text-decoration-none text-muted" onClick={onClose}>Cancelar</button>
                        <button type="submit" onClick={handleSubmit} className="btn btn-primary px-4 shadow-sm">
                            <i className="bi bi-save me-2"></i> Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};