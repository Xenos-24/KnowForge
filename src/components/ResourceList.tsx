import { Resource } from '../types/resource';
import { ResourceCard } from './ResourceCard';

interface ResourceListProps {
    resources: Resource[];
    onEdit: (resource: Resource) => void;
    onDelete: (id: string) => void;
}

export const ResourceList = ({ resources, onEdit, onDelete }: ResourceListProps) => {
    if (resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
                    <span className="text-4xl">📭</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No resources found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Get started by adding your first resource to the library.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((resource) => (
                <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};
