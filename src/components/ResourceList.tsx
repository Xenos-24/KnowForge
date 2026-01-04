import { useEffect, useState } from "react";
import { ResourceCard } from "./ResourceCard";
import { supabase } from "../lib/supabase";

export function ResourceList({ activeFolderId, activeType }: { activeFolderId: string | null; activeType?: string }) {
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

        // 2. Type Filters (Intersection)
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
                {resources.map((res) => (
                    <ResourceCard key={res.id} resource={res} />
                ))}
            </div>
        </div>
    );
}
