import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';

export const AdminLayout = () => {
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

            {/* CONTENIDO DE LA APP */}
            <Navbar links={[
                { label: <><i className="bi bi-person-circle me-1"></i> Usuarios</>, to: "/admin/users" },
                { label: <><i className="bi bi-clipboard-data me-1"></i> Quinielas</>, to: "/admin/quinielas" }
            ]} />

            <main className="container py-4 flex-grow-1">
                <Outlet />
            </main>
            <footer className="py-3 mt-auto border-top bg-white">
                <div className="container text-center">
                    <p className="text-muted small mb-1">© 2026 QuinielApp - Solo fines de entretenimiento.</p>
                </div>
            </footer>
        </div>
    );
};