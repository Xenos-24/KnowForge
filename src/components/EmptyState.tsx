import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md h-64 border-4 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center bg-transparent"
            >
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <Plus size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-400">It's a bit empty here!</h3>
                <p className="text-slate-400 text-sm mt-1">Drop something to get started.</p>
            </motion.div>
        </div>
    );
};
