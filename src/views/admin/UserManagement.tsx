import { useEffect, useState } from 'react';
import { apiCall } from '../../api/client';

export const UserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await apiCall({ method: 'GET', path: '/admin/users' });
            setUsers(res.data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await apiCall({
                method: 'PATCH',
                path: `/admin/users/${userId}/status`,
                body: { activo: !currentStatus }
            });
            fetchUsers(); // Recargamos la lista
        } catch (error) {
            alert("No se pudo cambiar el estado");
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0 text-white">Gestión de Usuarios</h2>
                <span className="badge bg-primary">{users.length} Registrados</span>
            </div>

            <div className="row g-3"> {/* g-3 es el espacio entre cards */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-3 text-white">Cargando usuarios...</p>
                    </div>
                ) : users.map(user => (
                    <div key={user._id} className="col-12 col-md-6 col-lg-3">
                        <div className="card h-100 shadow-sm border-0 position-relative">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                                        style={{ width: '40px', height: '40px' }}>
                                        {user.nombre[0]}{user.apellidos[0]}
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                                            {user.nombre}
                                        </h6>
                                        <h6 className="mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                                            {user.apellidos}
                                        </h6>
                                        <small className="text-muted">{user.rol}</small>
                                    </div>
                                </div>

                                <p className="small mb-2 text-truncate">
                                    <strong>Email:</strong> {user.correo}
                                </p>

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <span className={`badge ${user.activo ? 'bg-success' : 'bg-warning'}`}>
                                        {user.activo ? 'Activo' : 'Pendiente'}
                                    </span>

                                    {user.rol !== 'ADMIN' && <button
                                        className={`btn btn-sm ${user.activo ? 'btn-outline-danger' : 'btn-primary'}`}
                                        onClick={() => toggleStatus(user._id, user.activo)}
                                    >
                                        {user.activo ? 'Desactivar' : 'Activar Usuario'}
                                    </button>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};