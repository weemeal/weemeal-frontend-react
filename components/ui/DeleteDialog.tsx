'use client';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isDeleting?: boolean;
}

export default function DeleteDialog({
                                         isOpen,
                                         onClose,
                                         onConfirm,
                                         title = 'Rezept loeschen?',
                                         message = 'Moechtest du dieses Rezept wirklich loeschen? Diese Aktion kann nicht rueckgaengig gemacht werden.',
                                         isDeleting = false,
                                     }: DeleteDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center">
                {/* Warning Icon */}
                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-6">
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="w-8 h-8 text-error"
                    />
                </div>

                <h2 className="text-xl font-bold text-text-dark mb-3">{title}</h2>
                <p className="text-text-muted mb-8 max-w-sm mx-auto">{message}</p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="btn btn-outline min-w-[120px]"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="btn btn-error min-w-[120px]"
                    >
                        {isDeleting ? (
                            <>
                                <span
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                Loeschen...
                            </>
                        ) : (
                            'Loeschen'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
