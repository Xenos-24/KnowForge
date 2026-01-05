import { useEffect, useState } from "react";
import { ResourceCard } from "./ResourceCard";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export function ResourceList({ activeFolderId, activeType, onEdit, onDelete }: {
    activeFolderId: string | null;
    activeType?: string;
    onEdit?: (res: any) => void;
    onDelete?: (id: string) => void;
}) {
    const [resources, setResources] = useState<any[]>([]);

    useEffect(() => {
        fetchResources();
    }, [activeFolderId, activeType]);

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

        const { data, error } = await query;
        if (!error && data) setResources(data);
    }

    return (
        <div className="w-full p-8 pb-32">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">Library</h2>
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
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
