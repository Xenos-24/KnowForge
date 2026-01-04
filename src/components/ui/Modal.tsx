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
            <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 text-left shadow-2xl ring-1 ring-black/5 transition-all w-full max-w-lg flex flex-col max-h-[85vh]">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
                    <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
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
