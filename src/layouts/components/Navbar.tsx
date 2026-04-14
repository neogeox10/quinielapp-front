import { NavLink, useLocation } from 'react-router-dom';
import * as pkg from '../../../package.json';
import { useEffect, type ReactNode } from 'react';
import { Offcanvas } from 'bootstrap';
import { closeSession } from '../../util/close-session';

export interface NavItem {
    to: string;
    label: ReactNode;
}

interface NavbarProps {
    links?: NavItem[];
}

export const Navbar = ({ links = [] }: NavbarProps) => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const cleanup = () => {

        // A. Quitamos el foco de cualquier botón (especialmente la hamburguesa)
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // B. Limpiamos basura de Bootstrap en el body
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.classList.remove('modal-open'); // A veces Bootstrap la olvida

        // C. Eliminamos backdrops huérfanos
        const menuElement = document.getElementById('offcanvasNavbar');
        const entra = menuElement && !menuElement.classList.contains('show') && !menuElement.classList.contains('showing');
        if (entra) {
            const backdrops = document.querySelectorAll('.offcanvas-backdrop');
            backdrops.forEach(b => b.remove());
        }
    };

    // 1. EFECTO PRINCIPAL: Se ejecuta cada vez que cambias de página (URL)
    useEffect(() => {
        const menuElement = document.getElementById('offcanvasNavbar');
        if (menuElement) {
            menuElement.addEventListener('hidden.bs.offcanvas', cleanup);
            const instance = Offcanvas.getInstance(menuElement);

            if (instance) {
                instance.hide(); // Cerramos si está abierto
            }
        }
        return () => {
            cleanup();
            if (menuElement) {
                menuElement.removeEventListener('hidden.bs.offcanvas', cleanup);
            }
        };
    }, [location.pathname]); // <--- Se dispara al cambiar de ruta

    const cerrarMenuManual = () => {
        const menuElement = document.getElementById('offcanvasNavbar');
        if (menuElement) {
            const instance = Offcanvas.getOrCreateInstance(menuElement);
            instance.hide();
        }
    };

    const esActivo = (liga: string) => location.pathname === liga;

    return (
        <nav className="navbar sticky-top bg-primary shadow" data-bs-theme="dark">
            <div className="container-fluid px-3">
                <NavLink className='navbar-brand d-flex align-items-center fw-bold' to="/" onClick={cerrarMenuManual}>
                    <span><i className="bi bi-trophy-fill"></i> QuinielApp</span>
                </NavLink>

                <div className="d-flex align-items-center">
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar"
                        aria-controls="offcanvasNavbar"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" data-bs-theme="light">
                    <div className="offcanvas-header bg-primary text-white shadow-sm" data-bs-theme="dark">
                        <h5 className="offcanvas-title fw-bold">Menú Principal</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={cerrarMenuManual} aria-label="Close"></button>
                    </div>

                    <div className="offcanvas-body p-0 d-flex flex-column">
                        {user.rol && <div className="p-4 bg-body border-bottom mb-2 text-center">
                            <i className="bi bi-person-circle fs-1 mb-2 d-block text-primary"></i>
                            <h6 className="mb-0 fw-bold">{user.nombre} {user.apellidos}</h6>
                            <h6 className="mb-0 text-muted small">{user.correo}</h6>
                            <div className={`small mt-1 ${user.rol === 'ADMIN' ? 'text-success' : 'text-warning'}`}>
                                <i className="bi bi-shield-lock me-1"></i>
                                <span className="fw-bold">{user.rol}</span>
                            </div>
                        </div>}

                        <ul className="navbar-nav flex-grow-1 px-3 mt-5">
                            {links.map((link, index) => (
                                <li className="nav-item mb-1" key={index}>
                                    <NavLink
                                        className={`nav-link px-3 rounded-3 mx-2 d-flex align-items-center ${esActivo(link.to) ? 'bg-primary text-white active shadow-sm' : 'text-body'}`}
                                        to={link.to}
                                    >
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                            <li className="nav-item py-1">
                                <div className="fw-bold text-primary small text-uppercase px-3 mt-2 mb-1 text-center" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                                    <i className="bi bi-braces me-1"></i>Versión: {pkg.version}
                                </div>
                            </li>
                        </ul>

                        {user.rol && <div className="p-4 mt-auto border-top bg-body">
                            <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-2 fw-bold" onClick={() => { cerrarMenuManual(); closeSession(); }}>
                                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
        </nav>
    );
};