import { useState } from 'react';
import { apiCall } from '../../../api/client';

export const ResetPasswordModal = ({ usuarioId, onClose }: any) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const reset = async () => {
        try {
            setLoading(true);
            await apiCall({ method: 'PATCH', path: `/admin/users/${usuarioId}/resetPassword`, body: { newPassword } });
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
                        <h5 className="modal-title fw-bold">Reset Password</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-3 text-white">Cargando...</p>
                            </div>
                        ) :
                            error ? (
                                <div className="alert alert-danger d-flex align-items-center text-danger" role="alert">
                                    <i className="bi bi-exclamation-octagon-fill me-2"></i>{mensaje}
                                </div>
                            ) :
                                (
                                    <>
                                        <div className='d-flex justify-content-evenly py-3'>
                                            <label className='bold'>New Password</label><input type='text' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                            <button type="button" className="btn btn-primary me-2" onClick={reset}><i className="bi bi-save me-2"></i> Guardar</button>
                                        </div>
                                    </>
                                )}
                    </div>
                </div>
            </div>
        </div>
    );
};