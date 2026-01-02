import { Resource } from '../types/resource';
import { ResourceCard } from './ResourceCard';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from './EmptyState';

interface ResourceListProps {
    resources: Resource[];
    onEdit: (resource: Resource) => void;
    onDelete: (id: string) => void;
}

export const ResourceList = ({ resources, onEdit, onDelete }: ResourceListProps) => {
    if (resources.length === 0) {
        return <EmptyState />;
    }

    return (
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20"
        >
            <AnimatePresence mode="popLayout">
                {resources.map((resource) => (
                    <motion.div
                        key={resource.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ResourceCard
                            resource={resource}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};
