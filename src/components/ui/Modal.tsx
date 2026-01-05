import * as React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose} />

            {/* Content */}
            <div className="relative transform overflow-hidden rounded-2xl bg-surface-0 text-left shadow-2xl ring-1 ring-moderate transition-all w-full max-w-lg flex flex-col max-h-[85vh]">
                <div className="px-6 py-4 border-b border-subtle flex items-center justify-between shrink-0">
                    <h3 className="text-lg font-semibold leading-6 text-primary tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-secondary hover:text-primary hover:bg-surface-1 transition-colors focus:outline-none"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};
