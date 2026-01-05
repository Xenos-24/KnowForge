import { Resource } from '../types/resource';
import { Trash2, Edit, ExternalLink, Play, File, Link as LinkIcon, FileSpreadsheet, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

interface ResourceCardProps {
    resource: Resource;
    onEdit?: (resource: Resource) => void;
    onDelete?: (id: string) => void;
}

export const ResourceCard = ({ resource, onEdit, onDelete }: ResourceCardProps) => {
    // DnD Logic
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: resource.id,
        data: { type: 'resource', resource }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.8 : 1
    } : undefined;

    // Helper for Styles
    const getResourceStyle = (r: Resource) => {
        const title = r.title.toLowerCase();
        const type = r.type;

        // 1. EXCEL / SHEETS
        if (title.endsWith('.xlsx') || title.endsWith('.xls') || title.endsWith('.csv') || type === 'sheet') {
            return {
                headerBg: "bg-[#f5f1e8]", // Soft Cream
                iconColor: "text-[#8b7355]",
                markerColor: "bg-[#8b7355]",
                icon: <FileSpreadsheet className="text-[#8b7355] w-12 h-12" />,
                badge: "SHEET"
            };
        }

        // 2. WORD / DOCS
        if (title.endsWith('.docx') || title.endsWith('.doc') || type === 'doc') {
            return {
                headerBg: "bg-[#f0ebe3]", // Light Sand
                iconColor: "text-[#a08968]",
                markerColor: "bg-[#a08968]",
                icon: <FileText className="text-[#a08968] w-12 h-12" />,
                badge: "DOC"
            };
        }

        // 3. PDF
        if (title.endsWith('.pdf') || type === 'pdf') {
            return {
                headerBg: "bg-[#ede8e0]", // Warm Beige
                iconColor: "text-[#9b8b7e]",
                markerColor: "bg-[#9b8b7e]",
                icon: <File className="text-[#9b8b7e] w-12 h-12" />,
                badge: "PDF"
            };
        }

        // 4. Video
        if (type === 'video') {
            return {
                headerBg: 'bg-[#e8dfd5]', // Warm Taupe
                iconColor: 'text-[#8b7355]',
                markerColor: 'bg-[#8b7355]',
                icon: <Play className="text-[#8b7355] w-12 h-12" />,
                badge: 'VIDEO'
            };
        }

        // 5. Default / Link
        return {
            headerBg: 'bg-[#e9e4dc]', // Neutral Cream
            iconColor: 'text-[#9b8b7e]',
            markerColor: 'bg-[#9b8b7e]',
            icon: <LinkIcon className="text-[#9b8b7e] w-12 h-12" />,
            badge: 'LINK'
        };
    };

    const config = getResourceStyle(resource);
    const date = new Date(resource.created_at).toLocaleDateString();

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            // Keep DnD interaction but remove "Juice"
            className="h-full touch-none group relative pointer-events-auto"
        >
            <div className="flex flex-col h-full bg-surface-1 rounded-2xl overflow-hidden shadow-lg hover:bg-surface-2 hover:border-purple-500/20 hover:shadow-[0_8px_32px_-8px_rgba(139,92,246,0.15)] hover:-translate-y-1 transition-all duration-300 border border-subtle">

                {/* Visual Header (Solid Color) */}
                <div className={cn("relative h-40 w-full shrink-0 flex items-center justify-center overflow-hidden", config.headerBg)}>
                    {/* No Noise - Clean Solid Color */}

                    {resource.thumbnail_url ? (
                        <div className="absolute inset-0 z-10">
                            <img src={resource.thumbnail_url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                            {resource.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                        <Play size={20} className="text-white ml-1 fill-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative z-10">
                            {config.icon}
                        </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase bg-black/40 text-white/90 backdrop-blur-md border border-white/10">
                            {config.badge}
                        </span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col flex-1 relative border-t border-subtle">
                    {/* Pills: Folder, Type, Important */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {/* Folder Pill */}
                        {resource.folder && (
                            <span className="pill-folder px-2 py-0.5 rounded-full text-xs font-medium">
                                {resource.folder}
                            </span>
                        )}

                        {/* Type Pill */}
                        {resource.type && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${resource.type === 'video' ? 'pill-video' :
                                resource.type === 'pdf' || resource.type === 'doc' ? 'pill-doc' :
                                    'pill-link'
                                }`}>
                                {resource.type === 'video' ? '📹 Video' :
                                    resource.type === 'pdf' ? '📄 PDF' :
                                        resource.type === 'doc' ? '📝 Doc' :
                                            '🔗 Link'}
                            </span>
                        )}

                        {/* Important Star */}
                        {resource.is_important && (
                            <span className="pill-important px-2 py-0.5 rounded-full text-xs font-medium">
                                ⭐ Important
                            </span>
                        )}

                        <span className="text-xs font-medium text-tertiary ml-auto">{date}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-primary leading-tight mb-3 line-clamp-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); onEdit?.(resource); }}>
                        {resource.title}
                    </h3>

                    <p className="text-sm text-secondary line-clamp-3 mb-4 leading-relaxed">
                        {resource.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-subtle flex items-center justify-between">
                        <div className="flex gap-1" onMouseDown={(e) => e.stopPropagation()}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(resource);
                                }}
                                className="p-2 rounded-lg text-tertiary hover:bg-accent/10 hover:text-accent transition-colors"
                                title="Edit"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(resource.id);
                                }}
                                className="p-2 rounded-lg text-tertiary hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors" onMouseDown={(e) => e.stopPropagation()}>
                            Open <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                {/* The "Marker Line" Animation (Crucial) */}
                <div className="absolute bottom-0 left-0 w-full flex justify-center pb-[1px]">
                    <motion.div
                        initial={{ width: "0%", opacity: 0 }}
                        whileHover={{ width: "80%", opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={cn("h-[3px] rounded-full shadow-[0_0_10px_currentColor]", config.markerColor)}
                    />
                </div>
            </div>
        </motion.div>
    );
};
