import { Resource } from '../types/resource';
import { Video, FileText, BookOpen, Trash2, Edit, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface ResourceCardProps {
    resource: Resource;
    onEdit: (resource: Resource) => void;
    onDelete: (id: string) => void;
}

export const ResourceCard = ({ resource, onEdit, onDelete }: ResourceCardProps) => {

    const typeConfig = {
        Video: { color: 'bg-red-100 text-red-700', icon: Video, label: 'Video' },
        Article: { color: 'bg-blue-100 text-blue-700', icon: FileText, label: 'Article' },
        Tutorial: { color: 'bg-green-100 text-green-700', icon: BookOpen, label: 'Tutorial' }
    };

    const { color, icon: Icon, label } = typeConfig[resource.type];

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            onDelete(resource.id);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', color)}>
                    <Icon size={12} />
                    {label}
                </span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => onEdit(resource)}>
                        <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={handleDelete}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2" title={resource.title}>
                {resource.title}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
                {resource.description}
            </p>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline">
                    View Resource <ExternalLink size={14} className="ml-1" />
                </a>
            </div>
        </div>
    );
};
