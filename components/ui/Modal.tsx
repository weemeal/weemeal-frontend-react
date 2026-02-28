'use client';

import {useCallback, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function Modal({isOpen, onClose, title, children}: ModalProps) {
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    {title && <h2 className="text-xl font-semibold">{title}</h2>}
                    <button
                        onClick={onClose}
                        className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Schließen"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-gray-500"/>
                    </button>
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    );
}
