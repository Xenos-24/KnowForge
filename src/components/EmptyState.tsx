import { BoxSelect } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
        >
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                <div className="relative bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg border border-indigo-50 dark:border-zinc-800">
                    <BoxSelect size={48} className="text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No resources found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                Your library is currently empty. Start building your knowledge base by adding your first resource.
            </p>
        </motion.div>
    );
};
