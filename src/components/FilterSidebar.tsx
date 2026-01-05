import { useState } from "react";
import {
    LayoutGrid,
    Video,
    Link,
    File,
    Hash,
    Plus,
    Trash2
} from "lucide-react";
import { motion } from "framer-motion";

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
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    // Helper to count by group
    const countByType = (types: string[]) =>
        resources.filter((r: any) =>
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

    const handleCreateFolderKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const name = e.currentTarget.value.trim();
            if (name) {
                onCreateFolder(name);
            }
            setIsCreatingFolder(false);
        } else if (e.key === 'Escape') {
            setIsCreatingFolder(false);
        }
    };

    return (
        <aside className="w-64 flex-shrink-0 h-screen bg-surface-0 border-r border-subtle flex flex-col pt-6 pb-4">

            {/* 1. Primary Actions & Library */}
            <div className="px-4 mb-6 space-y-4">
                {/* Main Library Button (Global Reset) */}
                <div className="relative">
                    {/* Background Glider for Library? 
                        User: "Because both 'Categories' and 'Folders' share...". 
                        Library is separate state: activeFolderId === null && activeType === 'all'.
                        Let's try to include it in the layoutId if possible, or keep it separate style if it's "special".
                        User prompt specifically mentioned Categories and Folders sharing. 
                        Let's give Library its own distinct look or just keep it as is, 
                        BUT if we want it to participate, we need a consistent ID condition.
                        Let's keep Library separate/static styling for now as it's a "Reset" button, 
                        unless "activeItem" logic can handle it.
                        Current logic: activeFolderId=null & activeType=all.
                        Let's treat it as a special state.
                     */}
                    <button
                        onClick={() => { setActiveFolderId(null); setActiveType('all'); }}
                        className={`
                            relative z-10 w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 border border-white/5 active:scale-95
                            ${activeFolderId === null && activeType === 'all'
                                ? "text-white ring-1 ring-white/10"
                                : "text-gray-400 hover:text-white hover:bg-white/5"}
                        `}
                    >
                        {activeFolderId === null && activeType === 'all' && (
                            <motion.div
                                layoutId="activeItem"
                                className="absolute inset-0 bg-surface-1 shadow-lg rounded-xl"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-3">
                            <LayoutGrid size={20} className={activeFolderId === null && activeType === 'all' ? "text-accent" : ""} />
                            <span className="font-bold text-sm tracking-wide">Library</span>
                        </span>
                    </button>
                </div>

                {/* Resource Filters (Type Selection) */}
                <div className="space-y-1">
                    <h3 className="text-xs font-bold text-tertiary uppercase tracking-widest px-3 mb-2">Categories</h3>
                    {navItems.map((item) => {
                        const isActive = activeType === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveFolderId(null);
                                    setActiveType(item.id);
                                }}
                                className={`
                                    relative w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors active:scale-95
                                    ${isActive ? "text-accent" : "text-secondary hover:text-primary hover:bg-surface-1"}
                                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeItem"
                                        className="absolute inset-0 bg-surface-2/50 border-l-2 border-accent rounded-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <div className="relative z-10 flex items-center gap-3">
                                    <item.icon size={16} />
                                    <span>{item.label}</span>
                                </div>
                                {item.count > 0 && (
                                    <span className="relative z-10 text-xs opacity-40 font-mono">{item.count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Folders Section */}
            <div className="flex-1 overflow-y-auto px-4">
                {/* Header with (+) Button */}
                <div className="flex items-center justify-between px-2 mb-3 group">
                    <h3 className="text-xs font-bold text-tertiary uppercase tracking-widest">
                        Folders
                    </h3>
                    <button
                        onClick={() => setIsCreatingFolder(true)}
                        className="text-gray-500 hover:text-white transition-colors"
                        title="Create New Folder"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <div className="space-y-0.5">
                    {/* Inline Creation Input */}
                    {isCreatingFolder && (
                        <div className="px-4 py-2">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Folder Name..."
                                className="w-full bg-surface-0 text-primary text-sm border border-moderate rounded px-2 py-1 outline-none focus:border-accent transition-colors"
                                onBlur={() => setIsCreatingFolder(false)}
                                onKeyDown={handleCreateFolderKeyUp}
                            />
                        </div>
                    )}

                    {folders.map((folder: any) => {
                        const isActive = activeFolderId === folder.id;
                        return (
                            <div key={folder.id} className="relative group">
                                <button
                                    onClick={() => {
                                        setActiveFolderId(folder.id);
                                        setActiveType('all');
                                    }}
                                    className={`
                                        relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all active:scale-95
                                        ${isActive ? "text-primary pl-[14px]" : "text-secondary hover:text-primary hover:bg-surface-1"}
                                    `}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeItem"
                                            className="absolute inset-0 bg-surface-2/50 backdrop-blur-sm border-l-2 border-accent rounded-lg shadow-[inset_0_1px_0_0_rgba(160,137,104,0.1)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <Hash
                                        size={14}
                                        className={`
                                            relative z-10 transition-colors 
                                            ${isActive ? "text-accent" : "text-tertiary group-hover:text-secondary"}
                                        `}
                                    />
                                    <span className="relative z-10 truncate">{folder.name}</span>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Delete folder "${folder.name}"?`)) {
                                            onDeleteFolder(folder.id);
                                        }
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-20"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>


        </aside>
    );
}
