import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const AdminLayout = lazy(() => import('./layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const UserManagement = lazy(() => import('./views/admin/UserManagement').then(m => ({ default: m.UserManagement })));
const QuinielasList = lazy(() => import('./views/admin/QuinielasList').then(m => ({ default: m.QuinielasList })));


const PlayerLayout = lazy(() => import('./layouts/PlayerLayout').then(m => ({ default: m.PlayerLayout })));
const PlayerQuinielas = lazy(() => import('./views/player/PalyerQuinielas').then(m => ({ default: m.PlayerQuinielas })));


const GuestLayout = lazy(() => import('./layouts/GuestLayout').then(m => ({ default: m.GuestLayout })));
const Login = lazy(() => import('./views/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./views/Register').then(module => ({ default: module.Register })));
const Quinielas = lazy(() => import('./views/Quinielas').then(m => ({ default: m.Quinielas })));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<>Cargando...</>}>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route index element={<Navigate to="quinielas" />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="quinielas" element={<Quinielas />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="users" />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="quinielas" element={<QuinielasList />} />
          </Route>



          <Route path="/player" element={<PlayerLayout />}>
            <Route index element={<Navigate to="quinielas" />} />
            <Route path="quinielas" element={<PlayerQuinielas />} />
          </Route>

          <Route path="/" element={<InitialRedirect />} />

          <Route path="*" element={<Navigate to="/quinielas" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Componente auxiliar para redirigir al entrar a la raíz "/"
const InitialRedirect = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/quinielas" />;

  const user = JSON.parse(userStr);
  return user.rol === 'ADMIN'
    ? <Navigate to="/admin/users" />
    : <Navigate to="/player/quinielas" />;
};

export default App;