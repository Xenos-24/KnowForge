import { useState, useMemo } from 'react';
import { useResources } from './hooks/useResources';
import { FilterSidebar, FilterType } from './components/FilterSidebar';
import { ResourceList } from './components/ResourceList';
import { ResourceForm } from './components/ResourceForm';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { Resource, ResourceFormData } from './types/resource';
import { Plus, Menu } from 'lucide-react';
import { cn } from './lib/utils'; // Assuming you might use it for mobile menu toggle

function App() {
    const { resources, addResource, updateResource, deleteResource } = useResources();
    const [filter, setFilter] = useState<FilterType>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const filteredResources = useMemo(() => {
        if (filter === 'All') return resources;
        return resources.filter((r) => r.type === filter);
    }, [resources, filter]);

    const handleAddClick = () => {
        setEditingResource(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (resource: Resource) => {
        setEditingResource(resource);
        setIsModalOpen(true);
    };

    const handeFormSubmit = (data: ResourceFormData) => {
        if (editingResource) {
            updateResource(editingResource.id, data);
        } else {
            addResource(data);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="flex h-screen bg-white dark:bg-zinc-950 overflow-hidden text-gray-900 dark:text-white font-outfit">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Wrapper for Mobile */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-30 transition-transform duration-300 md:translate-x-0 md:static md:z-auto",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <FilterSidebar currentFilter={filter} onFilterChange={(f) => { setFilter(f); setIsMobileMenuOpen(false); }} />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={20} />
                        </Button>
                        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-500">Resourcery</h1>
                    </div>
                    <Button onClick={handleAddClick}>
                        <Plus size={18} className="mr-2" />
                        Add Resource
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-zinc-950/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{filter === 'All' ? 'All Resources' : `${filter}s`}</h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{filteredResources.length} items</span>
                        </div>

                        <ResourceList
                            resources={filteredResources}
                            onEdit={handleEditClick}
                            onDelete={deleteResource}
                        />
                    </div>
                </main>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingResource ? 'Edit Resource' : 'Add New Resource'}
            >
                <ResourceForm
                    initialData={editingResource || undefined}
                    onSubmit={handeFormSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}

export default App;
