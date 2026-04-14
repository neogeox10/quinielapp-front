import type { ReactNode } from "react";

interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    label?: ReactNode;
}

export const ConfirmModal = ({ title, message, onConfirm, onCancel, label = <><i className="bi bi-trash me-2"></i> Eliminar definitivamente</> }: ConfirmModalProps) => {
    return (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered shadow">
                <div className="modal-content border-0">
                    <div className="modal-body text-center p-5">
                        <div className="text-danger mb-4">
                            <i className="bi bi-exclamation-octagon" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h4 className="fw-bold mb-3">{title}</h4>
                        <p className="text-muted mb-4">{message}</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button type="button" className="btn btn-secondary px-4" onClick={onCancel}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-danger px-4 shadow-sm" onClick={onConfirm}>
                                {label}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};