import { Resource } from '../types/resource';
import { Video, FileText, BookOpen, Trash2, Edit, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface ResourceCardProps {
    resource: Resource;
    onEdit: (resource: Resource) => void;
    onDelete: (id: string) => void;
}

export const ResourceCard = ({ resource, onEdit, onDelete }: ResourceCardProps) => {

    const typeConfig = {
        Video: { color: 'text-red-500 bg-red-100 dark:bg-red-500/20', icon: Video, label: 'Video' },
        Article: { color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/20', icon: FileText, label: 'Article' },
        Tutorial: { color: 'text-green-500 bg-green-100 dark:bg-green-500/20', icon: BookOpen, label: 'Tutorial' }
    };

    const { color, icon: Icon, label } = typeConfig[resource.type];

    // Format date
    const date = new Date(resource.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return (
        <motion.div
            layout
            className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100/50 dark:hover:border-zinc-700 hover:-translate-y-1 flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className={cn('flex items-center justify-center w-8 h-8 rounded-full', color)}>
                        <Icon size={14} />
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">{label}</span>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" onClick={() => onEdit(resource)}>
                        <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onDelete(resource.id)}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors" title={resource.title}>
                {resource.title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                {resource.description}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">{date}</span>

                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline">
                    Visit <ExternalLink size={14} />
                </a>
            </div>
        </motion.div>
    );
};
