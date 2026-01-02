import { useState, useEffect, useCallback } from 'react';
import { Resource, ResourceFormData } from '../types/resource';
import { ResourceStorage } from '../services/storage';

export const useResources = () => {
    const [resources, setResources] = useState<Resource[]>([]);

    const loadResources = useCallback(() => {
        setResources(ResourceStorage.getResources());
    }, []);

    useEffect(() => {
        loadResources();

        // Optional: Listen to storage events for cross-tab sync
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'appcrafters_resources') {
                loadResources();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, [loadResources]);

    const addResource = useCallback((data: ResourceFormData) => {
        try {
            const newResource = ResourceStorage.addResource(data);
            loadResources();
            return newResource;
        } catch (error) {
            console.error("Error adding resource", error);
            throw error;
        }
    }, [loadResources]);

    const updateResource = useCallback((id: string, data: Partial<ResourceFormData>) => {
        ResourceStorage.updateResource(id, data);
        loadResources();
    }, [loadResources]);

    const deleteResource = useCallback((id: string) => {
        ResourceStorage.deleteResource(id);
        loadResources();
    }, [loadResources]);

    return {
        resources,
        addResource,
        updateResource,
        deleteResource,
        refreshResources: loadResources
    };
};
