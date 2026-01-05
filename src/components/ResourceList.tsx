import { useEffect, useState } from "react";
import { ResourceCard } from "./ResourceCard";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export function ResourceList({ activeFolderId, activeType, onEdit, onDelete, folders, onToggleImportant, resources: appResources }: {
    activeFolderId: string | null;
    activeType?: string;
    onEdit?: (res: any) => void;
    onDelete?: (id: string) => void;
    folders?: any[];
    onToggleImportant?: (id: string, isImportant: boolean) => void;
    resources?: any[]; // Resources from App to trigger refresh
}) {
    const [resources, setResources] = useState<any[]>([]);

    useEffect(() => {
        fetchResources();
    }, [activeFolderId, activeType, appResources?.length]); // Add appResources.length to trigger refresh

    // Wrapper to refresh after toggling important
    const handleToggleImportant = async (id: string, isImportant: boolean) => {
        if (onToggleImportant) {
            await onToggleImportant(id, isImportant);
            fetchResources();
        }
    };

    // Wrapper to refresh after editing
    const handleEdit = (resource: any) => {
        if (onEdit) {
            onEdit(resource);
            // Refresh after a short delay to allow modal to update
            setTimeout(() => fetchResources(), 500);
        }
    };

    // Wrapper to refresh after deleting
    const handleDelete = async (id: string) => {
        if (onDelete) {
            await onDelete(id);
            fetchResources(); // Refresh immediately after delete
        }
    };

    async function fetchResources() {
        let query = supabase.from('resources').select('*');

        // 1. Folder Filters
        if (activeFolderId) {
            query = query.eq('folder_id', activeFolderId);
        }

        // 2. Type Filters (Only if not 'all')
        if (activeType && activeType !== 'all') {
            if (activeType === 'video') {
                query = query.eq('type', 'video');
            } else if (activeType === 'link') {
                query = query.in('type', ['link', 'url', 'article', 'website']);
            } else if (activeType === 'doc') {
                query = query.in('type', ['pdf', 'doc', 'docx', 'sheet', 'slide']);
            }
        }

        // 3. Consistent ordering to prevent jumping
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (!error && data) setResources(data);
    }

    // Get display heading based on selection
    const getHeading = () => {
        if (activeFolderId && folders) {
            const folder = folders.find((f: any) => f.id === activeFolderId);
            return folder ? folder.name : 'Library';
        }

        if (activeType && activeType !== 'all') {
            const typeNames: Record<string, string> = {
                'video': 'Videos',
                'link': 'Links',
                'doc': 'Documents'
            };
            return typeNames[activeType] || 'Library';
        }

        return 'Library';
    };

    return (
        <div className="w-full p-8 pb-32">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-primary">{getHeading()}</h2>
                <p className="text-slate-500 mt-1">{resources.length} resources found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full">
                <AnimatePresence mode="popLayout">
                    {resources.map((res, index) => (
                        <motion.div
                            key={res.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                            layout
                        >
                            <ResourceCard
                                resource={res}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleImportant={handleToggleImportant}
                                folders={folders}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
