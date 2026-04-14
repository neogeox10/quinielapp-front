import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PrivacyModal } from './components/PrivacyModal';

export const PlayerLayout = () => {
    return (
        <div className="min-vh-100 d-flex flex-column position-relative">
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
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: -1,
                }}
            />
            <Navbar />
            <main className="container py-4 flex-grow-1">
                <Outlet />
            </main>
            <footer className="py-3 mt-auto border-top bg-white">
                <div className="container text-center">
                    <p className="text-muted small mb-1">© 2026 QuinielApp - Solo fines de entretenimiento.</p>
                    <button
                        id='showPrivacyModal'
                        className="btn btn-link btn-sm text-decoration-none"
                        data-bs-toggle="modal"
                        data-bs-target="#privacyModal"
                    >
                        Ver Aviso de Privacidad
                    </button>
                </div>
            </footer>
            <PrivacyModal />
        </div>
    );
};