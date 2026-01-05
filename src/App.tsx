import { useState } from "react";
import { useResources } from "./hooks/useResources";
import { FilterSidebar } from "./components/FilterSidebar";
import { ResourceList } from "./components/ResourceList";
import { KnowledgeGraph } from "./components/KnowledgeGraph";
import { Modal } from "./components/ui/Modal";
import { ResourceForm } from "./components/ResourceForm";

export default function App() {
    const { resources, folders, addResource, updateResource, createFolder, deleteFolder, deleteResource } = useResources();
    const [view, setView] = useState<"list" | "graph">("list");
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [activeType, setActiveType] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<any | null>(null);

    return (
        <div className="flex h-screen w-screen bg-app-bg overflow-hidden text-primary font-sans">
            {/* 1. Sidebar */}
            <div className="w-64 h-full flex-shrink-0 border-r border-subtle bg-surface-0">
                <FilterSidebar
                    activeFolderId={activeFolderId}
                    setActiveFolderId={setActiveFolderId}
                    activeType={activeType}
                    setActiveType={setActiveType}
                    onOpenModal={() => setIsModalOpen(true)}
                    folders={folders}
                    onDeleteFolder={deleteFolder}
                    onCreateFolder={async (name: string) => {
                        if (name) await createFolder(name, '#64748B');
                    }}
                    resources={resources}
                />
            </div>

            {/* 2. Main Content */}
            <div className="flex-1 h-full relative flex flex-col min-w-0">
                {/* Header: Glass Effect with Gradient Logo */}
                <header className="h-16 border-b border-subtle flex items-center justify-between px-8 bg-surface-0/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-20 shadow-[0_1px_0_0_rgba(139,92,246,0.1)]">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight leading-none text-[#8b7355]">KnowForge</h1>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setView(view === 'list' ? 'graph' : 'list')}
                            className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-secondary bg-surface-1 border border-moderate rounded-xl hover:bg-surface-2 hover:text-primary hover:border-purple-500/30 transition-all duration-200"
                        >
                            {view === 'list' ? 'View Graph' : 'View Library'}
                        </button>
                        <button
                            onClick={() => { setEditingResource(null); setIsModalOpen(true); }}
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-accent hover:bg-accent-hover rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
                        >
                            + Resource
                        </button>
                    </div>
                </header>

                {/* Main View Area */}
                <main className="flex-1 overflow-y-auto w-full p-0 bg-app-bg">
                    {view === 'list' ? (
                        <ResourceList
                            activeFolderId={activeFolderId}
                            activeType={activeType}
                            onEdit={(res) => { setEditingResource(res); setIsModalOpen(true); }}
                            onDelete={(id) => { if (confirm("Delete this resource?")) deleteResource(id); }}
                        />
                    ) : (
                        <div className="w-full h-full min-h-[500px]">
                            <KnowledgeGraph />
                        </div>
                    )}
                </main>
            </div>

            {/* Modal for New/Edit Resource */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingResource(null); }}
                title={editingResource ? "Edit Resource" : "Add Resource"}
            >
                <ResourceForm
                    initialData={editingResource || undefined}
                    availableResources={resources}
                    folders={folders}
                    onSubmit={async (data) => {
                        if (editingResource) {
                            await updateResource(editingResource.id, data);
                        } else {
                            await addResource(data);
                        }
                        setIsModalOpen(false);
                        setEditingResource(null);
                    }}
                    onCancel={() => { setIsModalOpen(false); setEditingResource(null); }}
                />
            </Modal>
        </div>
    );
}
