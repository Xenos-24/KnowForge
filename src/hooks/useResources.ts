import { useState, useEffect } from 'react';
import { Resource, ResourceFormData } from '../types/resource';
import { ResourceService } from '../services/resourceService';

export const useResources = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [folders, setFolders] = useState<{ id: string, name: string, color: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const [resData, folderData] = await Promise.all([
                ResourceService.getResources(),
                ResourceService.getFolders()
            ]);
            setResources(resData);
            setFolders(folderData);
        } catch (error) {
            console.error("Failed to refresh data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const addResource = async (data: ResourceFormData) => {
        await ResourceService.addResource(data);
        refresh();
    };

    const updateResource = async (id: string, data: Partial<Resource>) => {
        await ResourceService.updateResource(id, data);
        refresh();
    };

    const deleteResource = async (id: string) => {
        await ResourceService.deleteResource(id);
        refresh();
    };

    const createFolder = async (name: string, color: string) => {
        await ResourceService.createFolder(name, color);
        refresh();
    };

    const deleteFolder = async (id: string) => {
        await ResourceService.deleteFolder(id);
        refresh();
    };

    return {
        resources,
        folders,
        addResource,
        updateResource,
        deleteResource,
        createFolder,
        deleteFolder,
        isLoading
    };
};
