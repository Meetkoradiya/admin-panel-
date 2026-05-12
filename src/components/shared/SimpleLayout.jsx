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
        <div className="w-full flex flex-col min-h-screen bg-[#F8FAFC]">
            {/* Header - Sav Simple Flat */}
            <div className="w-full py-8 px-4">
                <h1 className="text-3xl font-medium text-slate-900 tracking-tight">{title}</h1>
            </div>

            {/* Main Content Area */}
            <div className="grow pb-24 px-4">
                <div className="space-y-6">
                    {children}
                </div>
            </div>

            {/* Footer - Fixed Bottom White */}
            <div className="fixed bottom-0 right-0 left-0 bg-white border-t border-slate-100 py-5 px-8 flex items-center justify-end gap-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                <Button
                    label="Discard"
                    icon="pi pi-trash"
                    variant="outlineDanger"
                    className="px-10 h-13 text-[15px] font-medium rounded-xl"
                    onClick={() => onDiscard ? onDiscard() : window.history.back()}
                />
                <Button
                    label={saveLabel}
                    variant="primary"
                    className="px-14 h-13 text-[15px] font-medium rounded-xl shadow-lg shadow-blue-500/10"
                    onClick={onSave}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export const SimpleSection = ({ title, children }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-2xl font-medium text-slate-800 mb-8 tracking-tight">
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
        <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#475569] ml-0.5">{label}</label>
            <div className="w-full relative">
                {children}
            </div>
            {error && <span className="text-rose-500 text-xs ml-1 font-medium mt-1 block">{error}</span>}
        </div>
    );
};
