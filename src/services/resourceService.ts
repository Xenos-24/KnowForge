import { v4 as uuidv4 } from 'uuid';
import { Resource, ResourceFormData } from '../types/resource';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'appcrafters_resources_v2';

export class ResourceService {

    // --- Auto-Magic Logic ---

    private static getYoutubeThumbnail(url: string): string | null {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
    }

    // --- CRUD Operations ---

    static async getResources(): Promise<Resource[]> {
        if (supabase) {
            const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
            if (error) {
                console.error('Supabase error:', error);
                return [];
            }
            return data as Resource[];
        } else {
            // Fallback to LocalStorage + Storytelling Seed
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) return JSON.parse(stored);

                // SEED DATA (Premium SaaS Storytelling)
                const seedData: Resource[] = [
                    {
                        id: 'video-1',
                        title: "The Psychology of Friendships",
                        description: "Key Takeaway: Dunbar's number explained. Understanding the cognitive limits of human relationships.",
                        type: 'video',
                        url: 'https://www.youtube.com/watch?v=ArfP7tP', // Dummy
                        thumbnail_url: 'https://img.youtube.com/vi/ArfP7tP/maxresdefault.jpg', // Placeholder
                        tags: ['Sociology'],
                        folder: 'Videos',
                        related_ids: [],
                        is_important: true,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'doc-1',
                        title: "Q3 Financial Projections.xlsx",
                        description: "Key Takeaway: 15% growth projected. Breakdown of revenue streams and cost optimization strategies.",
                        type: 'sheet', // Mapped to sheet
                        url: '#',
                        thumbnail_url: null,
                        tags: ['Finance'],
                        folder: 'Documents',
                        related_ids: [],
                        is_important: false,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'pdf-1',
                        title: "System Design Interview Guide",
                        description: "Key Takeaway: Focus on scalability, consistency patterns, and database sharding.",
                        type: 'pdf',
                        url: '#',
                        thumbnail_url: null,
                        tags: ['Career'],
                        folder: 'Documents',
                        related_ids: [],
                        is_important: true,
                        created_at: new Date().toISOString(),
                    }
                ];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
                return seedData;

            } catch (e) {
                return [];
            }
        }
    }

    static async addResource(data: ResourceFormData): Promise<Resource> {
        // Robust YouTube Detection
        const isYoutube = (data.type === 'video') && (
            data.url.includes('youtube.com') ||
            data.url.includes('youtu.be')
        );

        const autoThumbnail = isYoutube ? this.getYoutubeThumbnail(data.url) : null;
        const finalThumbnail = data.thumbnail_url || autoThumbnail || null;

        const newResource: Resource = {
            id: uuidv4(),
            title: data.title,
            description: data.description,
            type: data.type,
            url: data.url,
            thumbnail_url: finalThumbnail,
            tags: data.tags || [],
            folder: data.folder || 'General',
            related_ids: [],
            is_important: data.is_important || false,
            created_at: new Date().toISOString(),
        };

        if (supabase) {
            // Supabase Insert
            const { error } = await supabase.from('resources').insert([newResource]);
            if (error) throw error;
            return newResource;
        } else {
            // LocalStorage Insert
            const resources = await this.getResources();
            resources.unshift(newResource);
            this.saveToLocal(resources);
            return newResource;
        }
    }

    static async updateResource(id: string, data: Partial<Resource>): Promise<void> {
        if (supabase) {
            await supabase.from('resources').update(data).eq('id', id);
        } else {
            const resources = await this.getResources();
            const index = resources.findIndex(r => r.id === id);
            if (index !== -1) {
                resources[index] = { ...resources[index], ...data };
                this.saveToLocal(resources);
            }
        }
    }

    static async deleteResource(id: string): Promise<void> {
        if (supabase) {
            await supabase.from('resources').delete().eq('id', id);
        } else {
            const resources = await this.getResources();
            const filtered = resources.filter(r => r.id !== id);
            this.saveToLocal(filtered);
        }
    }

    // --- Folder Operations (V3) ---

    static async getFolders(): Promise<{ id: string, name: string, color: string }[]> {
        if (supabase) {
            const { data, error } = await supabase.from('folders').select('*').order('created_at', { ascending: true });
            if (error) return [];
            return data;
        }
        return [];
    }

    static async createFolder(name: string, color: string): Promise<void> {
        if (supabase) {
            const { error } = await supabase.from('folders').insert({ name, color });
            if (error) throw error;
        }
    }

    static async deleteFolder(folderId: string): Promise<void> {
        if (supabase) {
            // 1. Move resources to 'Unsorted' (folder_id: null)
            await supabase.from('resources').update({ folder_id: null, folder: 'General' }).eq('folder_id', folderId);

            // 2. Delete the folder
            const { error } = await supabase.from('folders').delete().eq('id', folderId);
            if (error) throw error;
        }
    }

    // Helper for LocalStorage
    private static saveToLocal(resources: Resource[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
    }
}
