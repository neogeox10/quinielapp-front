import { useEffect, useState } from 'react';
import { apiCall } from '../../../api/client';

export const QuinielaUsuariosModal = ({ quiniela, onClose }: any) => {

    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<string[]>(quiniela.usuarios || []);
    const [error, setError] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const fetchUsers = async () => {
        try {
            const res = await apiCall({ method: 'GET', path: '/admin/users' });
            setUsuarios(res.data.filter((u: any) => u.rol === 'PLAYER'));
        } catch (error) {
            setError(true);
            setMensaje('Error cargando usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const findUser = (u: string) => usuariosSeleccionados.includes(u);
    const toggle = (u: string) => {
        const isChecked = findUser(u);

        if (isChecked) {
            setUsuariosSeleccionados(usuariosSeleccionados.filter((us: string) => u !== us));
        } else {
            setUsuariosSeleccionados([...usuariosSeleccionados, u]);
        }
    };

    const guardar = async () => {
        try {
            setLoading(true);
            await apiCall({ method: 'PATCH', path: `/admin/quinielas/${quiniela._id}/usuarios`, body: { usuarios: usuariosSeleccionados } });
            onClose();
        } catch (error) {
            setError(true);
            setMensaje('Error guardando usuarios');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">{quiniela.nombre}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-3 text-white">Cargando usuarios...</p>
                            </div>
                        ) :
                            error ? (
                                <div className="alert alert-danger d-flex align-items-center text-danger" role="alert">
                                    <i className="bi bi-exclamation-octagon-fill me-2"></i>{mensaje}
                                </div>
                            ) :
                                (
                                    <>
                                        <ul className="list-group list-group-flush">
                                            {usuarios.map((u: any) => (
                                                <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                                    <div className="form-check form-switch">
                                                        <input id={u._id} className="form-check-input" role='switch' type="checkbox" defaultChecked={findUser(u._id)} onChange={() => toggle(u._id)} />
                                                        <label className="form-check-label" htmlFor={u._id}>
                                                            {u.correo}
                                                        </label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className='d-flex justify-content-end align-items-end py-3'>
                                            <button type="button" className="btn btn-primary me-2" onClick={guardar}><i className="bi bi-save me-2"></i> Guardar</button>
                                        </div>
                                    </>
                                )}
                    </div>
                </div>
            </div>
        </div>
    );
};