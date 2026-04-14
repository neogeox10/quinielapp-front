//src/util/close-session.ts
// Creamos el canal de autenticación
const authChannel = new BroadcastChannel('auth_sync_channel');

export const closeSession = (emitEvent = true) => {
    // 1. Preservar el tema
    const theme = localStorage.getItem('theme');

    // 2. Limpiar sesión
    localStorage.clear();

    // 3. Restaurar tema
    if (theme) {
        localStorage.setItem('theme', theme);
    }

    // 4. Notificar a las demás pestañas
    if (emitEvent) {
        authChannel.postMessage({ action: 'LOGOUT' });
    }

    // 5. Redirigir esta pestaña
    window.location.replace(`${window.location.origin}/login`);
};