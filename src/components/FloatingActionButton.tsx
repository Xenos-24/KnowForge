import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingActionButtonProps {
    onClick: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-purple-500 shadow-neon-purple flex items-center justify-center text-white border-2 border-white/20"
        >
            <Plus size={32} strokeWidth={3} />
        </motion.button>
    );
};
