import { LayoutGrid, Video, FileText, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export type FilterType = 'All' | 'Video' | 'Article' | 'Tutorial';

interface FilterSidebarProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export const FilterSidebar = ({ currentFilter, onFilterChange }: FilterSidebarProps) => {

    const filters: { id: FilterType; label: string; icon: any }[] = [
        { id: 'All', label: 'All Resources', icon: LayoutGrid },
        { id: 'Video', label: 'Videos', icon: Video },
        { id: 'Article', label: 'Articles', icon: FileText },
        { id: 'Tutorial', label: 'Tutorials', icon: BookOpen },
    ];

    return (
        <aside className="w-64 bg-gray-50 dark:bg-zinc-900/50 border-r border-gray-200 dark:border-zinc-800 h-screen p-4 hidden md:block shrink-0">
            <div className="space-y-1">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Filters</h2>
                {filters.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onFilterChange(item.id)}
                        className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                            currentFilter === item.id
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'
                        )}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
            </div>
        </aside>
    );
};
