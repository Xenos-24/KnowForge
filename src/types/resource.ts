export type ResourceType = 'Article' | 'Video' | 'Tutorial';

export interface Resource {
    id: string;
    title: string;
    description: string;
    type: ResourceType;
    link: string; // URL to the resource
    createdAt: string; // ISO Date string
}

export type ResourceFormData = Omit<Resource, 'id' | 'createdAt'>;
