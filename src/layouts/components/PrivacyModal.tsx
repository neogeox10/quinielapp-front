import { useState } from "react";
import { Modal } from "bootstrap";
import { apiCall } from "../../api/client";
import { ConfirmModal } from "../../views/admin/components/ConfirmModal";
import { closeSession } from "../../util/close-session";

export const PrivacyModal = ({ showButtons = true }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const setTerminos = async (respuesta: boolean) => {
        try {
            await apiCall({ method: 'POST', path: '/player/terminos', body: { terminosAceptados: respuesta } });
        } catch (error) {

        }
    };

    const confirm = async () => {
        await setTerminos(false);
        closeSession();
    };

    const aceptar = async () => {
        await setTerminos(true);
        window.location.replace(`${window.location.origin}/player/quinielas`);
    };

    const rechazar = async () => {
        // 2. Ocultamos el modal usando la instancia nativa de Bootstrap
        const modalEl = document.getElementById('privacyModal');
        if (modalEl) {
            const modalInstance = Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
        setShowConfirm(true);
    };

    const cancelar = async () => {
        setShowConfirm(false);

        // 3. Le damos 150ms a Bootstrap para que termine de limpiar su basura
        // antes de volver a pedirle que abra el modal de Privacidad
        setTimeout(() => {
            const modalEl = document.getElementById('privacyModal');
            if (modalEl) {
                const modalInstance = Modal.getOrCreateInstance(modalEl);
                modalInstance.show();
            }
        }, 150);
    };

    return (
        <>
            {
                showConfirm &&
                <ConfirmModal
                    title="Rechazar Términos"
                    message="Al rechazar los términos tu cuenta será eliminada y no podrás seguir usando QuinielApp"
                    label={<><i className="bi bi-trash me-2"></i> Eliminar mi cuenta</>}
                    onConfirm={confirm}
                    onCancel={cancelar}
                />
            }
            <div className="modal fade" id="privacyModal" tabIndex={-1} aria-labelledby="privacyModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content shadow-lg border-0">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title fw-bold" id="privacyModalLabel">
                                <i className="bi bi-shield-lock-fill me-2"></i>
                                Términos y Condiciones - QuinielApp
                            </h5>
                            <button id='hidePrivacyModal' type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4 bg-light">
                            <section className="mb-4">
                                <h6 className="fw-bold text-primary text-uppercase" style={{ fontSize: '0.85rem' }}>1. Finalidad Única de Entretenimiento</h6>
                                <p className="small text-muted">
                                    El usuario reconoce y acepta que <strong>QuinielApp es una plataforma digital con fines estrictamente recreativos y de entretenimiento.</strong>
                                </p>
                                <ul className="small text-muted">
                                    <li>La aplicación no gestiona, recauda ni procesa pagos, apuestas reales, ni transacciones monetarias de ninguna índole.</li>
                                    <li>Cualquier acuerdo externo entre los usuarios sobre premios o incentivos es ajeno a la plataforma y responsabilidad total de los involucrados.</li>
                                    <li>QuinielApp se deslinda de cualquier uso ilícito o comercial que los usuarios pretendan darle a la herramienta.</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h6 className="fw-bold text-primary text-uppercase" style={{ fontSize: '0.85rem' }}>2. Responsable del Tratamiento de Datos</h6>
                                <p className="small text-muted">
                                    QuinielApp informa que los datos personales proporcionados (Nombre, Apellidos y Correo Electrónico) serán tratados exclusivamente para la gestión de su cuenta, la visualización en la tabla de posiciones (Leaderboard) y la autenticación mediante JWT.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h6 className="fw-bold text-primary text-uppercase" style={{ fontSize: '0.85rem' }}>3.  Uso de la Información</h6>
                                <p className="small text-muted">
                                    Sus datos no serán compartidos, vendidos ni transferidos a terceros con fines comerciales. La información se almacena de forma segura en una base de datos protegida y solo se utiliza para:
                                </p>
                                <ul className="small text-muted">
                                    <li>Mantener el perfil de usuario activo.</li>
                                    <li>Calcular los puntajes de las quinielas en base a las reglas establecidas.</li>
                                    <li>Notificar actualizaciones relevantes de la plataforma.</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h6 className="fw-bold text-primary text-uppercase" style={{ fontSize: '0.85rem' }}>4. Mecánica de Puntuación y Resultados</h6>
                                <p className="small text-muted">
                                    El usuario acepta que la asignación de puntos se realiza de manera automatizada bajo los siguientes criterios preestablecidos por la administración de <strong>QuinielApp</strong>:
                                </p>
                                <ul className="small text-muted">
                                    <li><strong>Acierto de Ganador o Empate:</strong> Se otorgará 1 si el usuario acierta quién gana el encuentro o si hay empate.</li>
                                    <li><strong>Acierto de Marcador Exacto:</strong> Se otorgarán 3 puntos al usuario que prediga el resultado final idéntico al marcador oficial.</li>
                                    <li><strong>Resultados Oficiales:</strong> Los puntos se calculan basados en los resultados oficiales al finalizar el tiempo reglamentario (según las reglas de cada torneo). <strong>QuinielApp</strong> no se hace responsable por errores en fuentes externas de resultados, aunque la administración se compromete a corregir discrepancias técnicas a la brevedad posible.</li>
                                    <li><strong>Decisión Final:</strong> En caso de empate técnico en la tabla general al final del torneo, los criterios de desempate serán los definidos por el organizador de la quiniela específica.</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h6 className="fw-bold text-primary text-uppercase" style={{ fontSize: '0.85rem' }}>5. Seguridad</h6>
                                <p className="small text-muted">
                                    Implementamos medidas técnicas como el cifrado de contraseñas (hashing) y validación de tokens para proteger su acceso. Sin embargo, se recomienda al usuario no utilizar contraseñas idénticas a las de sus servicios financieros o personales sensibles.
                                </p>
                            </section>

                            <section className="mb-4">
                                <h6 className="fw-bold text-primary text-uppercase" style={{ fontSize: '0.85rem' }}>6. Consentimiento</h6>
                                <p className="small text-muted">
                                    Al registrarse y utilizar <strong>QuinielApp</strong>, usted otorga su consentimiento para el tratamiento de sus datos bajo estos términos y confirma que entiende el carácter recreativo de esta aplicación.
                                </p>
                            </section>

                            <div className="alert alert-warning py-2 mb-0" style={{ fontSize: '0.75rem' }}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                Al continuar usando esta aplicación, confirmas que eres mayor de edad y aceptas el uso recreativo de la misma.
                            </div>
                        </div>
                        {showButtons && <div className="modal-footer border-0 bg-light d-flex justify-content-evenly">
                            <button type="button" className="btn btn-danger px-4 fw-bold" onClick={rechazar} >Rechazar los términos</button>
                            <button type="button" className="btn btn-primary px-4 fw-bold" onClick={aceptar}>&nbsp;Acepto los términos&nbsp;</button>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
};