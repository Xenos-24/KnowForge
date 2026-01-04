import {
    LayoutGrid,
    Video,
    Link,
    File,
    Hash,
    Plus,
    Trash2
} from "lucide-react";

export function FilterSidebar({
    activeFolderId,
    setActiveFolderId,
    activeType,
    setActiveType,
    onOpenModal,
    onCreateFolder,
    folders,
    onDeleteFolder,
    resources = []
}: any) {

    // Helper to count by group
    const countByType = (types: string[]) =>
        resources.filter((r: any) =>
            // If folder is selected, count only in that folder (Intersection Count)
            // Or if global count is desired, remove folder check. 
            // The prompt implies "Display these real numbers", usually context-aware is better, 
            // but for simplicity and checking the prompt "Refactor the sidebar... logic".
            // Let's keep it simple: Count ALL matching that type for now, or match the VIEW?
            // "If I am in the 'Work' folder... I should only see resources..." implies the LIST updates.
            // Sidebar counts usually show "what's available". Let's assume Global counts for now unless specified.
            // Actually, usually counts update with filters. Let's do intersection if folder is active?
            // "Display these real numbers in the Sidebar." - Logic v1 was global. Let's stick to global for consistency unless logic demands.
            // Re-reading: "Refactor the filtering logic... in sidebar and parent".
            // Let's implement global counts for the categories to show total inventory, as standard sidebars do.
            types.includes(r.type)
        ).length;

    const counts = {
        video: countByType(['video']),
        link: countByType(['link', 'url', 'article', 'website']),
        doc: countByType(['pdf', 'doc', 'docx', 'sheet', 'slide'])
    };

    const navItems = [
        { id: 'video', label: 'Videos', icon: Video, count: counts.video },
        { id: 'link', label: 'Links', icon: Link, count: counts.link },
        { id: 'doc', label: 'Documents', icon: File, count: counts.doc },
    ];

    return (
        <aside className="w-64 flex-shrink-0 h-screen bg-[#0C0C12] border-r border-white/5 flex flex-col pt-6 pb-4">

            {/* 1. Primary Actions & Library */}
            <div className="px-4 mb-6 space-y-4">
                {/* Main Library Button (Global Reset) */}
                <button
                    onClick={() => { setActiveFolderId(null); setActiveType('all'); }}
                    className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border border-white/5
                        ${activeFolderId === null && activeType === 'all'
                            ? "bg-[#1E1E2E] shadow-lg text-white ring-1 ring-white/10"
                            : "text-gray-400 hover:text-white hover:bg-white/5"}
                    `}
                >
                    <LayoutGrid size={20} className={activeFolderId === null && activeType === 'all' ? "text-purple-500" : ""} />
                    <span className="font-bold text-sm tracking-wide">Library</span>
                </button>

                {/* Resource Filters (Type Selection) */}
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                // CHANGE: Do NOT reset folder. Only set type.
                                setActiveType(item.id);
                            }}
                            className={`
                                w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors
                                ${activeType === item.id
                                    ? "bg-purple-500/10 text-purple-400"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={16} />
                                <span>{item.label}</span>
                            </div>
                            {item.count > 0 && (
                                <span className="text-xs opacity-40 font-mono">{item.count}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Folders Section */}
            <div className="flex-1 overflow-y-auto px-4">
                {/* Header with (+) Button */}
                <div className="flex items-center justify-between px-2 mb-3 group">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Folders
                    </h3>
                    <button
                        onClick={onCreateFolder}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Create New Folder"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <div className="space-y-0.5">
                    {folders.map((folder: any) => (
                        <div key={folder.id} className="relative group">
                            <button
                                onClick={() => {
                                    setActiveFolderId(folder.id);
                                    // CHANGE: Reset type to 'all' when switching folders (clean slate UX)
                                    setActiveType('all');
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all
                                    ${activeFolderId === folder.id
                                        ? "bg-white/5 text-white border-l-2 border-purple-500 pl-[14px]"
                                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-2 border-transparent"}
                                `}
                            >
                                <Hash
                                    size={14}
                                    className={`
                                        transition-colors 
                                        ${activeFolderId === folder.id ? "text-purple-500" : "text-gray-600 group-hover:text-gray-400"}
                                    `}
                                />
                                <span className="truncate">{folder.name}</span>
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Delete folder "${folder.name}"?`)) {
                                        onDeleteFolder(folder.id);
                                    }
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Bottom 'Add Resource' Button */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={onOpenModal}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                    <Plus size={16} />
                    <span>New Resource</span>
                </button>
            </div>
        </aside>
    );
}
