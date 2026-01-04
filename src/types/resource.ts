export type ResourceType = 'video' | 'article' | 'pdf' | 'doc' | 'sheet' | 'link';

export interface Folder {
    id: string;
    name: string;
    color: string;
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: ResourceType;
    url: string; // Used for both external links and Supabase storage files
    thumbnail_url: string | null; // Nullable, auto-generated
    tags: string[]; // text array
    folder: string; // grouping category
    folder_id?: string; // New FK
    related_ids: string[]; // for Knowledge Graph
    is_important: boolean;
    created_at: string; // ISO timestamp
}

export type ResourceFormData = Omit<Resource, 'id' | 'created_at' | 'thumbnail_url' | 'related_ids'> & {
    // Optional file for upload flow
    file?: File;
    related_ids?: string[];
    thumbnail_url?: string | null;
};
