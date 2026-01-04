import { useDroppable } from '@dnd-kit/core';
import { cn } from '../lib/utils';
import { Folder, Trash2 } from 'lucide-react';

interface SidebarFolderProps {
    id: string;
    name: string;
    color: string;
    isActive: boolean;
    onClick: () => void;
    onDelete: () => void;
}

export const SidebarFolder = ({ id, name, isActive, onClick, onDelete }: SidebarFolderProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `folder-${name}`,
        data: { type: 'folder', name, id }
    });

    return (
        <div className="relative group flex items-center">
            <button
                ref={setNodeRef}
                onClick={onClick}
                className={cn(
                    'flex-grow flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-200 rounded-2xl mx-2', // Squircle shape with margin
                    isActive
                        ? 'bg-slate-100 text-slate-800 shadow-sm' // Active: Soft gray squircle
                        : 'text-slate-500 hover:bg-white hover:shadow-sticker hover:text-slate-700 hover:-translate-y-0.5' // Hover: Sticker effect
                )}
            >
                <Folder size={18} className={cn(
                    isActive ? 'fill-slate-400 text-slate-400' : 'fill-transparent',
                    isOver && 'fill-blue-400 animate-pulse'
                )} />
                {name}
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="absolute right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Folder"
            >
                <Trash2 size={12} />
            </button>
        </div>
    );
};
