import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';

/**
 * ImageUploader — Drag-and-drop or click-to-browse image upload component.
 * Props:
 *   onFileSelect(file: File) — called whenever a valid image file is selected.
 *   accept — optional mime-type filter (default "image/*")
 */
const ImageUploader = ({ onFileSelect, accept = 'image/*' }) => {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [dragging, setDragging] = useState(false);

    const processFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        onFileSelect?.(file);
    };

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const clearPreview = () => {
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
        onFileSelect?.(null);
    };

    return (
        <div className="w-full">
            {preview ? (
                <div className="relative group rounded-2xl overflow-hidden border-2 border-blue-200 shadow-inner">
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-2xl" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 rounded-2xl">
                        <Button
                            icon="pi pi-trash"
                            className="w-10 h-10 rounded-xl bg-rose-500 border-none text-white text-sm shadow-lg"
                            onClick={clearPreview}
                            tooltip="Remove image"
                        />
                        <Button
                            icon="pi pi-upload"
                            className="w-10 h-10 rounded-xl bg-blue-500 border-none text-white text-sm shadow-lg"
                            onClick={() => inputRef.current?.click()}
                            tooltip="Replace image"
                        />
                    </div>
                </div>
            ) : (
                <div
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                        dragging
                            ? 'border-blue-400 bg-blue-50 scale-[1.01]'
                            : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${dragging ? 'bg-blue-100 text-blue-500' : 'bg-slate-100 text-slate-400'}`}>
                        <i className="pi pi-image text-2xl" />
                    </div>
                    <p className="font-bold text-slate-600 text-sm text-center">
                        {dragging ? 'Drop to upload' : 'Drop image here or click to browse'}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">JPG, PNG, WEBP — max 5 MB</p>
                    <Button
                        label="+ Upload Image"
                        className="mt-4 bg-blue-600 border-none text-white text-xs px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-100 hover:bg-blue-700 transition-all"
                        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                    />
                </div>
            )}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
};

export { ImageUploader };
export default ImageUploader;
