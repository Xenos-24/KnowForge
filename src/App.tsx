import { useState, useMemo } from 'react';
import { useResources } from './hooks/useResources';
import { FilterSidebar, FilterType } from './components/FilterSidebar';
import { ResourceList } from './components/ResourceList';
import { ResourceForm } from './components/ResourceForm';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { Resource, ResourceFormData } from './types/resource';
import { Plus, Menu, Hammer, BookOpen } from 'lucide-react';
import { cn } from './lib/utils';
import { Toaster, toast } from 'sonner';

import { ConfirmDialog } from './components/ui/ConfirmDialog';

function App() {
    const { resources, addResource, updateResource, deleteResource } = useResources();
    const [filter, setFilter] = useState<FilterType>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

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
        try {
            if (editingResource) {
                updateResource(editingResource.id, data);
                toast.success('Resource updated successfully');
            } else {
                addResource(data);
                toast.success('Resource created successfully');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteResource(deleteId);
            toast.success('Resource deleted');
            setDeleteId(null);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900 overflow-hidden text-slate-800 dark:text-white font-sans selection:bg-indigo-100 selection:text-indigo-700">
            <Toaster position="top-right" richColors />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Wrapper for Mobile */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 md:translate-x-0 md:static md:z-auto shadow-2xl md:shadow-none",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <FilterSidebar currentFilter={filter} onFilterChange={(f) => { setFilter(f); setIsMobileMenuOpen(false); }} />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="px-6 py-4 flex items-center justify-between shrink-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-30 border-b border-indigo-100/50 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </Button>
                        <div className="flex items-center gap-2.5">
                            <div className="relative flex items-center justify-center p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg shadow-lg shadow-indigo-500/20 text-white">
                                <Hammer size={20} className="relative z-10" />
                                <BookOpen size={14} className="absolute bottom-1.5 right-1.5 opacity-80" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                                KnowForge
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={handleAddClick}
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full text-sm font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                    >
                        <Plus size={18} />
                        <span>Add Resource</span>
                    </button>

                    {/* Mobile Add Button */}
                    <button
                        onClick={handleAddClick}
                        className="md:hidden flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform"
                    >
                        <Plus size={20} />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
                                    {filter === 'All' ? 'Library' : `${filter}s`}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
                                </p>
                            </div>
                        </div>

                        <ResourceList
                            resources={filteredResources}
                            onEdit={handleEditClick}
                            onDelete={handleDelete}
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

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Resource"
                description="Are you sure you want to delete this resource? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}

export default App;
