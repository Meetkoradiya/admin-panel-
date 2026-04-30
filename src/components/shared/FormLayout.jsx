import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { Page } from './Page';
import { LayoutContext } from '@/app/context/layoutcontent';
import { classNames } from 'primereact/utils';

const FormLayout = ({
    title,
    loading,
    onSave,
    onDiscard,
    saveLabel = "Create",
    discardLabel = "Discard",
    isEditMode = false,
    children,
    sidebar,
}) => {
    const { layoutState } = useContext(LayoutContext);
    const isSidebarCollapsed = layoutState.staticMenuDesktopInactive;

    return (
        <Page title={title}>
            <div className="w-full flex flex-col items-stretch animate-fade-in pb-24">
                <div className="w-full mb-6 px-1">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
                </div>

                <div className={classNames("w-full flex flex-col items-stretch gap-6", { "lg:grid lg:grid-cols-4": sidebar })}>
                    <div className={classNames("flex flex-col items-stretch gap-6", sidebar ? "lg:col-span-3" : "w-full")}>
                        {children}
                    </div>

                    {sidebar && (
                        <div className="lg:col-span-1 flex flex-col gap-6 w-full">
                            {sidebar}
                        </div>
                    )}
                </div>

                {/* Fixed Footer Actions */}
                <div className={classNames(
                    "fixed bottom-0 right-0 bg-white border-t border-slate-100 p-5 z-40 transition-all duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]",
                    isSidebarCollapsed ? "left-0" : "left-0 md:left-70"
                )}>
                    <div className="w-full flex justify-end gap-4 mx-auto px-6">
                        <Button
                            label={discardLabel}
                            icon="pi pi-trash"
                            className="p-button-outlined p-button-danger border-rose-100 text-rose-500 font-bold px-6 rounded-xl h-10 text-sm"
                            onClick={onDiscard}
                            disabled={loading}
                        />
                        <Button
                            label={isEditMode ? "Update Details" : saveLabel}
                            icon={loading ? "pi pi-spin pi-spinner" : ""}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 rounded-xl h-10 border-none transition-all shadow-lg shadow-blue-500/10 text-sm"
                            onClick={onSave}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </Page>
    );
};

export const FormSection = ({ title, icon, children }) => (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-all">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
        </div>
        <div className="w-full flex flex-col items-stretch">
            {children}
        </div>
    </div>
);

export default FormLayout;
