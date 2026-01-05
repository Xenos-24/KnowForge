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
        <div className="flex h-screen w-screen bg-[#111118] overflow-hidden text-white font-sans">
            {/* 1. Sidebar */}
            <div className="w-64 h-full flex-shrink-0 border-r border-white/5 bg-[#0C0C12]">
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
                {/* Header: Strict Text Branding (No Logo, No Subtitle) */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0F0F14]/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-20">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white leading-none">KnowForge</h1>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setView(view === 'list' ? 'graph' : 'list')}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 border border-white/10 rounded-md hover:bg-white/5 transition-colors"
                        >
                            {view === 'list' ? 'View Graph' : 'View Library'}
                        </button>
                        <button
                            onClick={() => { setEditingResource(null); setIsModalOpen(true); }}
                            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#8B5CF6] rounded-md shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:bg-[#7c3aed] transition-all"
                        >
                            + Resource
                        </button>
                    </div>
                </header>

                {/* Main View Area */}
                <main className="flex-1 overflow-y-auto w-full p-0 bg-[#111118]">
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
