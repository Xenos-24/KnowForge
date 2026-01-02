import { LayoutGrid, Video, FileText, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

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
        <aside className="w-64 h-full bg-white/70 dark:bg-zinc-900/70 border-r border-indigo-100/50 dark:border-zinc-800 backdrop-blur-xl flex flex-col p-4 shrink-0">
            <div className="space-y-1 mt-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">Library</h2>
                {filters.map((item) => {
                    const isActive = currentFilter === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onFilterChange(item.id)}
                            className={cn(
                                'relative w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group',
                                isActive
                                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-900/20'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-500/10 shadow-sm"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-3">
                                <item.icon size={18} className={cn(isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600")} />
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto p-4 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-zinc-800 dark:to-zinc-800 rounded-2xl border border-indigo-100/50 dark:border-zinc-700">
                <p className="text-xs text-indigo-900/60 dark:text-zinc-400 font-medium text-center">
                    KnowForge v1.0
                </p>
            </div>
        </aside>
    );
};
