import { v4 as uuidv4 } from 'uuid';
import { Resource, ResourceFormData } from '../types/resource';

const STORAGE_KEY = 'appcrafters_resources';

export class ResourceStorage {
    static getResources(): Resource[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load resources:', error);
            return [];
        }
    }

    static addResource(data: ResourceFormData): Resource {
        const resources = this.getResources();
        const newResource: Resource = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
        };

        // Validate UUID and Date generation
        if (!newResource.id || !newResource.createdAt) {
            throw new Error('Failed to generate resource metadata');
        }

        resources.push(newResource);
        this.saveResources(resources);
        return newResource;
    }

    static updateResource(id: string, data: Partial<ResourceFormData>): void {
        const resources = this.getResources();
        const index = resources.findIndex((r) => r.id === id);

        if (index !== -1) {
            resources[index] = { ...resources[index], ...data };
            this.saveResources(resources);
        }
    }

    static deleteResource(id: string): void {
        const resources = this.getResources();
        const filtered = resources.filter((r) => r.id !== id);
        this.saveResources(filtered);
    }

    private static saveResources(resources: Resource[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
        } catch (error) {
            console.error('Failed to save resources:', error);
        }
    }
}
