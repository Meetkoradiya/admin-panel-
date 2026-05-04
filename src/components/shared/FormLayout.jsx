import React, { useContext } from 'react';
import Button from "@/components/ui/Button";
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
            <div className="w-full flex flex-col items-stretch animate-fade-in pb-24 pt-4">
                <div className="w-full mb-8 px-1">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
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
                    "fixed bottom-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-5 z-40 transition-all duration-300",
                    isSidebarCollapsed ? "left-0" : "left-0 md:left-[280px]"
                )}>
                    <div className="flex justify-end gap-4 px-6">
                        <Button
                            label={discardLabel}
                            icon="pi pi-trash"
                            variant="secondary"
                            className="text-rose-500 border-rose-100 hover:bg-rose-50"
                            onClick={onDiscard}
                            disabled={loading}
                        />
                        <Button
                            label={isEditMode ? "Update Details" : saveLabel}
                            variant="primary"
                            loading={loading}
                            onClick={onSave}
                            className="px-10"
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
            {icon && <i className={`${icon} text-slate-400 text-lg`} />}
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
        </div>
        <div className="w-full flex flex-col items-stretch">
            {children}
        </div>
    </div>
);

export default FormLayout;

