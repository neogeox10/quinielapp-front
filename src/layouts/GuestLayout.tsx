import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PrivacyModal } from './components/PrivacyModal';

export const GuestLayout = () => {
    return (
        <div className="min-vh-100 d-flex flex-column position-relative">
            {/* CAPA DE FONDO DIFUMINADA */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/cancha.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(8px)', // Ajusta el nivel de difuminado aquí
                    transform: 'scale(1.1)', // Evita que se vean bordes blancos al difuminar
                    zIndex: -1, // Lo manda al fondo de todo
                }}
            />

            {/* OVERLAY OSCURO (Opcional: ayuda a que el contenido resalte más) */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Capa negra semi-transparente
                    zIndex: -1,
                }}
            />
            <Navbar links={[
                { label: <><i className="bi bi-box-arrow-in-right me-1"></i> Login</>, to: "/login" },
                { label: <><i className="bi bi-person-fill-add me-1"></i> Register</>, to: "/register" },
                { label: <><i className="bi bi-clipboard-data me-1"></i> Quinielas</>, to: "/quinielas" }
            ]} />
            <main className="container py-4 flex-grow-1">
                <Outlet />
            </main>
            <footer className="py-3 mt-auto border-top bg-white">
                <div className="container text-center">
                    <p className="text-muted small mb-1">© 2026 QuinielApp - Solo fines de entretenimiento.</p>
                    <button
                        className="btn btn-link btn-sm text-decoration-none"
                        data-bs-toggle="modal"
                        data-bs-target="#privacyModal"
                    >
                        Ver Aviso de Privacidad
                    </button>
                </div>
            </footer>
            <PrivacyModal showButtons={false} />
        </div>
    );
};