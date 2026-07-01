import { SORTED_COUNTRIES } from '../../../constants/countries.constants';
import { fechaHora } from '../../../util/fechaHoraUtils';

export const ViewMatchesModal = ({ quiniela, onClose }: any) => {
    const getCountry = (fifa: string) => SORTED_COUNTRIES.find(c => c.fifa === fifa);

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">{quiniela.nombre}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group list-group-flush">
                            {quiniela.partidos.map((p: any, i: number) => {
                                const local = getCountry(p.local);
                                const visita = getCountry(p.visitante);
                                return (
                                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <div className="text-center" style={{ flex: 1 }}>
                                            <img src={local?.bandera||'/desconocido.png'} width="30" className="border rounded shadow-sm mb-1" />
                                            <div className="small fw-bold">{local?.nombreES||'A definir'}</div>
                                        </div>
                                        <div className="px-3 text-center">
                                            <span className="h4 mb-0 fw-bold">
                                                {p.resultadoLocal ?? '-'} : {p.resultadoVisitante ?? '-'}
                                            </span>
                                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                {fechaHora(p.fecha)}
                                            </div>
                                        </div>
                                        <div className="text-center" style={{ flex: 1 }}>
                                            <img src={visita?.bandera||'/desconocido.png'} width="30" className="border rounded shadow-sm mb-1" />
                                            <div className="small fw-bold">{visita?.nombreES||'A definir'}</div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};