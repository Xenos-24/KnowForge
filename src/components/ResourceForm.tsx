import { useForm } from 'react-hook-form';
import { ResourceFormData } from '../types/resource';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useEffect } from 'react';

interface ResourceFormProps {
    initialData?: ResourceFormData;
    onSubmit: (data: ResourceFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ResourceForm = ({ initialData, onSubmit, onCancel, isLoading }: ResourceFormProps) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ResourceFormData>({
        defaultValues: {
            title: '',
            description: '',
            link: '',
            type: 'Article' // Default
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input
                    label="Title"
                    placeholder="e.g. Understanding React Hooks"
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required' })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Type</label>
                <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-zinc-700 dark:text-white"
                    {...register('type', { required: 'Type is required' })}
                >
                    <option value="Article">Article</option>
                    <option value="Video">Video</option>
                    <option value="Tutorial">Tutorial</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-zinc-700 dark:text-white"
                    placeholder="Brief description of the resource..."
                    {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div>
                <Input
                    label="Link URL"
                    placeholder="https://example.com/resource"
                    error={errors.link?.message}
                    {...register('link', {
                        required: 'Link is required',
                        pattern: {
                            value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                            message: 'Please enter a valid URL'
                        }
                    })}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Save Resource</Button>
            </div>
        </form>
    );
};
