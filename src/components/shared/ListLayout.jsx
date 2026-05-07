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
    const icon = props.icon || "pi-database";

    return (
        <Page title={title}>
            <div className="flex flex-col gap-8 animate-fade-in pb-10">
                {/* 1. HEADER & ACTIONS */}
                <div className="layout-card">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 md:p-8">
                        <div className="flex items-center gap-5">
                            <div className="premium-badge h-14 w-14 rounded-2xl">
                                <i className={`pi ${icon} text-2xl`}></i>
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
                                    {title}
                                </h1>
                                {subtitle && <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] mt-1.5">{subtitle}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-10">
                            <div className="w-full sm:w-72">
                                <QuickSearchInput
                                    value={globalFilter}
                                    onInput={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Search records..."
                                />
                            </div>
                            <div className="flex items-center gap-5">
                                {extraActions}
                                {onAdd && (
                                    <Button
                                        label={addLabel}
                                        icon="pi pi-plus"
                                        variant="primary"
                                        onClick={onAdd}
                                        className="px-6 h-10 font-bold text-[13px] rounded-xl shadow-lg shadow-blue-500/20"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SUMMARY CARDS (OPTIONAL) */}
                {stats && stats.length > 0 && (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
                        {stats.map((s, i) => (
                            <div key={i} className="layout-card p-7 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[145px] relative">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{s.label}</span>
                                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{s.value}</h2>
                                </div>
                                <div className={`text-[10px] font-semibold ${s.textColor || 'text-blue-500'} mt-5 flex items-center gap-2`}>
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

                {/* 3. MAIN TABLE */}
                <div className="layout-card">
                    <DataTable
                        value={data}
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
