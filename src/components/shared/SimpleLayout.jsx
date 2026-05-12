import React from 'react';
import Button from '@/components/ui/Button';

export const SimpleLayout = ({
    title,
    children,
    onSave,
    loading,
    saveLabel = 'Save Changes',
    onDiscard
}) => {
    return (
        <div className="w-full flex flex-col min-h-screen bg-slate-50/50">
            {/* Header */}
            <div className="w-full py-4">
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
            </div>

            {/* Main Content Area */}
            <div className="grow pb-16">
                <div className="space-y-4">
                    {children}
                </div>
            </div>

            {/* Sticky Footer - Sav Simple Solid White */}
            <div className="fixed bottom-0 right-0 left-0 bg-white border-t border-slate-100 py-4 px-8 flex items-center justify-end gap-4 z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.04)]">
                <Button
                    label="Discard"
                    icon="pi pi-trash"
                    variant="outlineDanger"
                    className="px-10 h-12 text-base"
                    onClick={() => onDiscard ? onDiscard() : window.history.back()}
                />
                <Button
                    label={saveLabel}
                    variant="primary"
                    className="px-14 h-12 text-base"
                    onClick={onSave}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export const SimpleSection = ({ title, children }) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm transition-all hover:shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">
                {title}
            </h2>
            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

export const SimpleField = ({ label, children, error }) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold text-slate-500 ml-0.5">{label}</label>
            {children}
            {error && <span className="text-rose-500 text-xs ml-1 font-medium">{error}</span>}
        </div>
    );
};
