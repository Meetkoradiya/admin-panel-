import React from 'react';
import { DataTable } from 'primereact/datatable';
import Button from "@/components/ui/Button";
import { Page } from './Page';
import QuickSearchInput from './QuickSearchInput';
import { CreateButton } from './FormButtons';

import noDataImg from '@/assets/illustrations/no-data.png';

const ListLayout = ({
    title,
    subtitle,
    data,
    loading,
    onAdd,
    addLabel = "Add",
    extraActions,
    globalFilter,
    setGlobalFilter,
    children,
    emptyMessage = "No records found",
    emptyImage,
    stats,
    ...props
}) => {
    const header = (
        <div className="flex flex-col">
            <div className="px-6 py-6 bg-white flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
                {subtitle && <p className="text-sm font-medium text-slate-400">{subtitle}</p>}
            </div>
            <div className="px-6 py-5 bg-blue-50/50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full md:w-80">
                    <QuickSearchInput
                        value={globalFilter}
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search records..."
                    />
                </div>
                <div className="flex items-center gap-3">
                    {extraActions}
                    {onAdd && (
                        <CreateButton
                            label={addLabel}
                            onClick={onAdd}
                        />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <Page title={title}>
            <div className="flex flex-col gap-8 animate-fade-in pb-10">
                {/* 1. SUMMARY CARDS (OPTIONAL) */}
                {stats && stats.length > 0 && (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 px-0`}>
                        {stats.map((s, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[145px] relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{s.label}</span>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{s.value}</h2>
                                </div>
                                <div className={`text-[10px] font-bold ${s.textColor || 'text-blue-500'} mt-5 flex items-center gap-2`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                                    {s.sub}
                                </div>
                                <div className={`absolute right-7 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl ${s.bg || 'bg-blue-50'} flex items-center justify-center ${s.iconColor || 'text-blue-500'} shadow-inner shadow-white/20`}>
                                    <i className={`pi ${s.icon || 'pi-file'} text-2xl`} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. MAIN TABLE */}
                <div className="w-full bg-white rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                    <DataTable
                        value={data}
                        header={header}
                        loading={loading}
                        globalFilter={globalFilter}
                        paginator
                        rows={10}
                        className="p-datatable-minimal"
                        responsiveLayout="scroll"
                        emptyMessage={
                            <div className="text-center py-24 flex flex-col items-center justify-center bg-white">
                                <img
                                    src={emptyImage || noDataImg}
                                    alt="No Data"
                                    className="w-80 h-auto mb-6 opacity-90 pointer-events-none select-none"
                                    draggable="false"
                                    onContextMenu={(e) => e.preventDefault()}
                                    onDragStart={(e) => e.preventDefault()}
                                />
                                <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{emptyMessage}</div>
                                <p className="text-xs text-slate-300 font-medium tracking-wide">Try adjusting your filters or adding a new record</p>
                            </div>
                        }
                        dataKey={(data) => data.id || data._id || `row_${Math.random()}`}
                        rowHover
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        {...props}
                    >
                        {children}
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default ListLayout;


