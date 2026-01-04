import { useCallback, useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { ResourceFormData, Resource } from '../types/resource';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { UploadCloud, Link as LinkIcon, FileText, Youtube, X, Plus, Search, Network } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ResourceFormProps {
    initialData?: ResourceFormData;
    currentResourceId?: string;
    availableResources: Resource[];
    folders: { id: string, name: string }[];
    onSubmit: (data: ResourceFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ResourceForm = ({ initialData, currentResourceId, availableResources, folders, onSubmit, onCancel, isLoading }: ResourceFormProps) => {
    const { register, handleSubmit, setValue, watch, reset } = useForm<ResourceFormData>({
        defaultValues: {
            title: '',
            description: '',
            url: '',
            type: 'link',
            tags: [],
            folder: 'General',
            folder_id: undefined,
            is_important: false,
            related_ids: []
        }
    });

    const watchedUrl = watch('url');
    const watchedType = watch('type');
    const watchedRelatedIds = watch('related_ids') || [];

    // Combobox State
    const [searchQuery, setSearchQuery] = useState('');
    const [isComboboxOpen, setIsComboboxOpen] = useState(false);

    // Filter available resources (exclude self and already selected)
    const filteredOptions = useMemo(() => {
        return availableResources
            .filter(r => r.id !== currentResourceId) // Exclude self
            .filter(r => !watchedRelatedIds.includes(r.id)) // Exclude already selected
            .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [availableResources, currentResourceId, watchedRelatedIds, searchQuery]);

    const selectedResources = useMemo(() => {
        return availableResources.filter(r => watchedRelatedIds.includes(r.id));
    }, [availableResources, watchedRelatedIds]);

    const toggleRelation = (id: string) => {
        const current = watchedRelatedIds;
        if (current.includes(id)) {
            setValue('related_ids', current.filter(rid => rid !== id));
        } else {
            setValue('related_ids', [...current, id]);
        }
        setSearchQuery('');
    };

    useEffect(() => {
        if (!watchedUrl) return;
        if (watchedUrl.includes('youtube.com') || watchedUrl.includes('youtu.be')) {
            setValue('type', 'video');
        } else if (watchedUrl.endsWith('.pdf')) {
            setValue('type', 'pdf');
        } else if (watchedUrl.includes('docs.google.com')) {
            setValue('type', 'doc');
        }
    }, [watchedUrl, setValue]);

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setValue('title', file.name);
            setValue('url', URL.createObjectURL(file));

            if (file.type.includes('pdf')) setValue('type', 'pdf');
            else if (file.type.includes('image')) setValue('type', 'article');
            else if (file.type.includes('video')) setValue('type', 'video');
            else if (file.type.includes('sheet') || file.name.endsWith('xlsx')) setValue('type', 'sheet');
            else setValue('type', 'doc');

            toast.success("File ready for upload!");
        }
    }, [setValue]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={cn(
                    "relative group border-2 border-dashed rounded-2xl p-8 transition-all duration-300 text-center cursor-pointer",
                    isDragActive
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02]"
                        : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                )}
            >
                <input {...getInputProps()} />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

                <div className="flex flex-col items-center gap-3 relative z-10">
                    <div className="p-4 bg-white dark:bg-zinc-800 rounded-full shadow-lg shadow-indigo-100 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
                        {watchedType === 'video' ? <Youtube className="text-red-500" size={32} /> :
                            watchedType === 'pdf' ? <FileText className="text-pink-500" size={32} /> :
                                <UploadCloud className="text-indigo-500" size={32} />
                        }
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                            {isDragActive ? "Drop to upload!" : "Drag & Drop or Paste URL"}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Supports Video, PDF, Docs, and Links
                        </p>
                    </div>
                </div>
            </div>

            {/* URL Input */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <LinkIcon size={16} />
                </div>
                <input
                    {...register('url', { required: 'URL or File is required' })}
                    placeholder="https://..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Title"
                    placeholder="Resource Title"
                    {...register('title', { required: 'Title is required' })}
                    className="bg-slate-50 dark:bg-zinc-900/50"
                />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Folder</label>
                    <select
                        {...register('folder')}
                        className="w-full h-10 px-3 py-2 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                        onChange={(e) => {
                            const selectedName = e.target.value;
                            if (selectedName === 'Library') {
                                setValue('folder', 'Library');
                                setValue('folder_id', undefined); // Null in DB
                            } else {
                                const folder = folders.find(f => f.name === selectedName);
                                if (folder) {
                                    setValue('folder', folder.name);
                                    setValue('folder_id', folder.id);
                                }
                            }
                        }}
                    >
                        <option value="Library">Library (Default)</option>
                        {folders.map(folder => (
                            <option key={folder.id} value={folder.name}>{folder.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                    {...register('description')}
                    placeholder="Add some context..."
                    className="w-full min-h-[100px] p-3 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white resize-none"
                />
            </div>

            {/* Smart Connections Multi-Select */}
            <div className="space-y-2 relative">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Network size={14} className="text-indigo-500" />
                    Related Resources
                </label>

                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedResources.map(r => (
                        <span key={r.id} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-md border border-indigo-100 dark:border-indigo-500/20">
                            {r.title}
                            <button type="button" onClick={() => toggleRelation(r.id)} className="hover:text-indigo-900 dark:hover:text-white">
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>

                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Search size={14} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search to connect..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setIsComboboxOpen(true); }}
                        onFocus={() => setIsComboboxOpen(true)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white"
                    />
                </div>

                <AnimatePresence>
                    {isComboboxOpen && searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar"
                        >
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-slate-400 text-center">No matching resources found.</div>
                            ) : (
                                filteredOptions.map(r => (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => toggleRelation(r.id)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 flex items-center justify-between group"
                                    >
                                        <span className="truncate pr-4">{r.title}</span>
                                        <Plus size={14} className="opacity-0 group-hover:opacity-100 text-indigo-500" />
                                    </button>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {isComboboxOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsComboboxOpen(false)}
                    />
                )}
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="important"
                    {...register('is_important')}
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 focus:ring-2"
                />
                <label htmlFor="important" className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as High Priority</label>
            </div>

            <div className="flex justify-start gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800/50 sticky bottom-0 bg-white dark:bg-zinc-900 pb-2">
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
                <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex-[2] bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] border-0 text-white transition-all duration-300"
                >
                    Save to Library
                </Button>
            </div>
        </form>
    );
};
