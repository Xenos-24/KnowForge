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
                headerBg: "bg-[#BEF264]", // Neon Lime (Solid)
                iconColor: "text-black", // Contrast for light lime
                markerColor: "bg-[#BEF264]",
                icon: <FileSpreadsheet className="text-black/80 w-12 h-12" />,
                badge: "SHEET"
            };
        }

        // 2. WORD / DOCS
        if (title.endsWith('.docx') || title.endsWith('.doc') || type === 'doc') {
            return {
                headerBg: "bg-[#3B82F6]", // Bright Blue (Solid)
                iconColor: "text-white",
                markerColor: "bg-[#3B82F6]",
                icon: <FileText className="text-white w-12 h-12" />,
                badge: "DOC"
            };
        }

        // 3. PDF
        if (title.endsWith('.pdf') || type === 'pdf') {
            return {
                headerBg: "bg-[#EF4444]", // Vibrant Red (Solid)
                iconColor: "text-white",
                markerColor: "bg-[#EF4444]",
                icon: <File className="text-white w-12 h-12" />,
                badge: "PDF"
            };
        }

        // 4. Video
        if (type === 'video') {
            return {
                headerBg: 'bg-[#A855F7]', // Lavender/Purple (Solid)
                iconColor: 'text-white',
                markerColor: 'bg-[#A855F7]',
                icon: <Play className="text-white w-12 h-12" />,
                badge: 'VIDEO'
            };
        }

        // 5. Default / Link
        return {
            headerBg: 'bg-[#64748B]', // Slate (Solid)
            iconColor: 'text-white',
            markerColor: 'bg-[#64748B]',
            icon: <LinkIcon className="text-white w-12 h-12" />,
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
            <div className="flex flex-col h-full bg-[#15151A] rounded-xl overflow-hidden shadow-lg hover:bg-[#1E1E24] hover:border-purple-500/40 hover:shadow-purple-900/20 transition-all duration-200 border border-white/5">

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
                <div className="p-5 flex flex-col flex-1 relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-[rgba(237,237,237,0.4)] uppercase tracking-widest">{resource.folder}</span>
                        <span className="text-[10px] font-medium text-[rgba(237,237,237,0.4)]">{date}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#EDEDED] leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); onEdit?.(resource); }}>
                        {resource.title}
                    </h3>

                    <p className="text-xs text-[rgba(237,237,237,0.6)] line-clamp-3 mb-4 leading-relaxed font-normal">
                        {resource.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-[#ffffff0f] flex items-center justify-between">
                        <div className="flex gap-2" onMouseDown={(e) => e.stopPropagation()}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(resource);
                                }}
                                className="text-[rgba(237,237,237,0.4)] hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(resource.id);
                                }}
                                className="text-[rgba(237,237,237,0.4)] hover:text-red-400 transition-colors p-1 hover:bg-white/5 rounded"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[rgba(237,237,237,0.6)] hover:text-white flex items-center gap-1 transition-colors" onMouseDown={(e) => e.stopPropagation()}>
                            OPEN <ExternalLink size={12} />
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
