import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../api/client';
import { useTheme } from '../hooks/useTheme';

export const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        password: ''
    });
    const [status, setStatus] = useState({ loading: false, error: '', success: false });
    const navigate = useNavigate();
    useTheme();

    const usuario = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (usuario.rol === 'ADMIN') {
            navigate('/admin/dashboard');
        }

        if (usuario.rol === 'PLAYER') {
            navigate('/quinielas');
        }
    }, [usuario]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            await apiCall({
                method: 'POST',
                path: '/auth/register',
                body: formData
            });
            setStatus({ loading: false, error: '', success: true });
            // Opcional: Redirigir después de 3 segundos
            setTimeout(() => navigate('/login'), 5000);
        } catch (err: any) {
            setStatus({
                loading: false,
                error: err.response?.data?.message || 'Error al registrarse',
                success: false
            });
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5"        >
            <div className="w-100" style={{ maxWidth: '600px' }}>
                <div
                    className="card shadow-lg border-0 cristal"
                    style={{
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: '20px'
                    }}
                >
                    <div className="card-body p-4 p-md-5">
                        {/* Cabecera con Logo pequeño para dar contexto */}
                        <div className="text-center mb-4">
                            <img
                                src="/icono.png"
                                alt="QuinielApp Logo"
                                className="rounded-circle shadow-sm mb-3 bg-white p-1"
                                style={{ width: '90px', height: '90px', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.1)' }}
                            />
                            <h2 className="fw-bold text-primary mb-1">Únete a la QuinielApp</h2>
                            <p className="text-muted small">Crea tu cuenta para empezar a pronosticar</p>
                        </div>

                        {status.success && (
                            <div className="alert alert-success border-0 shadow-sm mb-4">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                ¡Registro exitoso! Tu cuenta está pendiente de activación por un administrador.
                            </div>
                        )}
                        {status.error && (
                            <div className="alert alert-danger border-0 shadow-sm mb-4">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {status.error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small fw-bold text-dark">Nombre</label>
                                    <input type="text" className="form-control bg-white bg-opacity-75" required
                                        placeholder="Ej. Juan"
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small fw-bold text-dark">Apellidos</label>
                                    <input type="text" className="form-control bg-white bg-opacity-75" required
                                        placeholder="Ej. Pérez"
                                        onChange={e => setFormData({ ...formData, apellidos: e.target.value })} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-dark">Correo Electrónico</label>
                                <input type="email" className="form-control bg-white bg-opacity-75" required
                                    placeholder="juan@ejemplo.com"
                                    onChange={e => setFormData({ ...formData, correo: e.target.value })} />
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-dark">Contraseña</label>
                                <input type="password" className="form-control bg-white bg-opacity-75" required
                                    placeholder="Mínimo 6 caracteres"
                                    onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>

                            {/* Botones Lado a Lado del mismo ancho */}
                            <div className="d-flex gap-3 mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark py-2 flex-fill fw-bold"
                                    onClick={() => navigate('/login')}
                                >
                                    <i className="bi bi-arrow-left me-2"></i>Atrás
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary py-2 flex-fill fw-bold shadow-sm"
                                    disabled={status.loading}
                                >
                                    {status.loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Espera...</>
                                    ) : (
                                        'Registrarme'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-4 pt-3 border-top border-dark border-opacity-10">
                            <p className="small text-muted mb-0">
                                Al registrarte, aceptas que tu cuenta sea revisada por el administrador.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};