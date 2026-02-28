'use client';

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
                                         title = 'Rezept löschen',
                                         message = 'Möchtest du dieses Rezept wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
                                         isDeleting = false,
                                     }: DeleteDialogProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="delete-dialog p-0">
                <h2 className="text-xl font-semibold text-error mb-4">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="delete-dialog-buttons">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="btn btn-outline px-6"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="btn btn-error px-6 flex items-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <span
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                Löschen...
                            </>
                        ) : (
                            'Löschen'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
