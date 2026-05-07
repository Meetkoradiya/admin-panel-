import React from 'react';
import { Button } from 'primereact/button';

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
            <div className="w-full py-6">
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
            </div>

            {/* Main Content Area */}
            <div className="grow pb-32">
                <div className="space-y-8">
                    {children}
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 right-0 left-0 bg-white border-t border-slate-100 py-4 px-10 flex items-center justify-end gap-3 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <Button
                    label="Discard"
                    icon="pi pi-trash"
                    outlined
                    severity="danger"
                    className="font-medium rounded-xl px-8 border-rose-500 text-rose-500 hover:bg-rose-50 transition-all text-sm h-11"
                    onClick={() => onDiscard ? onDiscard() : window.history.back()}
                />
                <Button
                    label={saveLabel}
                    icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                    className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none font-medium rounded-xl px-12 shadow-lg shadow-blue-500/30 text-white transition-all text-sm h-11 flex items-center gap-2 transform active:scale-95"
                    onClick={onSave}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export const SimpleSection = ({ title, children }) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
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
            <label className="text-[14px] font-bold text-slate-600 ml-1">{label}</label>
            {children}
            {error && <span className="text-rose-500 text-xs ml-1 font-medium">{error}</span>}
        </div>
    );
};
