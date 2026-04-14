import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { apiCall } from '../api/client';
import { useTheme } from '../hooks/useTheme';

export const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const navigate = useNavigate();
    const UNAUTHORIZED = 401;
    const FORBIDDEN = 403;

    useTheme();

    const usuario = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (usuario.rol === 'ADMIN') {
            navigate('/admin/users');
        }

        if (usuario.rol === 'PLAYER') {
            navigate('/player/quinielas');
        }
    }, [usuario]);

    const handleLoginManual = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await apiCall({
                method: 'POST',
                path: '/auth/login',
                body: { correo, password }
            });
            guardarSesion(res);
        } catch (err: any) {
            setError('Error al iniciar sesión');
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            // Enviamos el token de Google al backend
            const res = await apiCall({
                method: 'POST',
                path: '/auth/google',
                body: { idToken: credentialResponse.credential }
            });
            guardarSesion(res);
        } catch (err: any) {
            setError('Error en la autenticación con Google');
        }
    };

    const guardarSesion = (res: any) => {
        if (res.status === FORBIDDEN) {
            setInfo('Espera a que tu usuario sea activado por un Administrador.');
            return;
        }
        if (res.status === UNAUTHORIZED) {
            setInfo('Usuario y/o Contraseña incorrectos.');
            return;
        }
        localStorage.setItem('token', res.headers.get('authorization'));
        localStorage.setItem('user', JSON.stringify(res.data));

        if (res.data.rol === 'ADMIN') {
            navigate('/admin/users');
        } else {
            navigate('/player/quinielas');
        }
    };

    return (
        <div
            className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5"

        >
            <div className="w-100" style={{ maxWidth: '450px' }}>
                {/* 2. Card Semi-transparente con efecto Blur */}
                <div
                    className="card shadow-lg border-0 cristal"
                    style={{
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: '20px'
                    }}
                >
                    <div className="card-body p-5">
                        {/* Sección del Avatar y Nombre (Agregué un fondo sutil al logo) */}
                        <div className="text-center mb-4">
                            <img
                                src="/icono.png"
                                alt="QuinielApp Logo"
                                className="rounded-circle shadow-sm mb-3 bg-white p-1"
                                style={{ width: '90px', height: '90px', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.1)' }}
                            />
                            <h2 className="fw-bold text-primary mb-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>QuinielApp</h2>
                            <p className="text-muted small">Ingresa para gestionar tus pronósticos</p>
                        </div>

                        <h3 className="text-center mb-4 h5 fw-normal text-secondary">Bienvenido</h3>

                        {error && <div className="alert alert-danger small py-2 border-warning">{error}</div>}
                        {info && <div className="alert alert-info small py-2 border-warning">{info}</div>}

                        <form onSubmit={handleLoginManual}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-dark">Correo electrónico</label>
                                <input type="email" className="form-control bg-white bg-opacity-75" required
                                    placeholder="nombre@correo.com"
                                    onChange={e => setCorreo(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-dark">Contraseña</label>
                                <input type="password" className="form-control bg-white bg-opacity-75" required
                                    placeholder="••••••••"
                                    onChange={e => setPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mb-3 py-2 fw-bold shadow-sm">
                                Ingresar
                            </button>
                        </form>

                        <div className="d-flex align-items-center my-4">
                            <hr className="flex-grow-1 opacity-25" />
                            <span className="mx-2 text-muted small">o continúa con</span>
                            <hr className="flex-grow-1 opacity-25" />
                        </div>

                        <div className="d-flex justify-content-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Error al conectar con Google')}
                                useOneTap
                                theme="filled_blue"
                                text="continue_with"
                                shape="pill"
                            />
                        </div>
                        <div className="text-center mt-4 pt-2 border-top border-dark border-opacity-10">
                            <button className="btn btn-link btn-sm text-decoration-none text-dark"
                                onClick={() => navigate('/register')}>
                                ¿No tienes cuenta? <span className="fw-bold text-primary">Regístrate aquí</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};