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
    saveLabel = "Save Changes",
    discardLabel = "Discard",
    isEditMode = false,
    children,
    sidebar,
}) => {
    const { layoutState } = useContext(LayoutContext);
    const isSidebarCollapsed = layoutState.staticMenuDesktopInactive;

    return (
        <Page title={title}>
            <div className="flex flex-col h-full animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
                </div>

                <div className={sidebar ? "grid grid-cols-1 lg:grid-cols-4 gap-8 mb-24" : "flex flex-col gap-8 mb-24"}>
                    {/* Main Form Area */}
                    <div className={sidebar ? "lg:col-span-3 flex flex-col gap-8" : "w-full flex flex-col gap-8"}>
                        {children}
                    </div>

                    {/* Sidebar Area (Optional) */}
                    {sidebar && (
                        <div className="lg:col-span-1 flex flex-col gap-8">
                            {sidebar}
                        </div>
                    )}
                </div>

                <div className={classNames(
                    "fixed bottom-0 right-0 bg-white border-t border-slate-100 p-4 z-40 shadow-2xl transition-all duration-300",
                    isSidebarCollapsed ? "left-0" : "left-0 md:left-[280px]"
                )}>
                    <div className="flex flex-col-reverse md:flex-row justify-end gap-3 px-8 w-full">
                        <Button
                            label={discardLabel}
                            icon="pi pi-times"
                            className="btn-secondary btn-responsive"
                            onClick={onDiscard}
                            disabled={loading}
                        />
                        <Button
                            label={isEditMode ? "Update Details" : saveLabel}
                            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                            className="btn-primary btn-responsive"
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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-5">
            {icon && <i className={`${icon} text-blue-500 text-lg`} />}
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="flex flex-col gap-6">
            {children}
        </div>
    </div>
);

export default FormLayout;
