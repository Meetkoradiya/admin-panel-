import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Tooltip } from 'primereact/tooltip';
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
    renderItem,
    ...props
}) => {
    const icon = props.icon || "pi-database";

    return (
        <Page title={title}>
            <Tooltip target=".action-tooltip" position="bottom" />
            <div className="flex flex-col gap-4 animate-fade-in pb-4">
                {/* 1. HEADER & ACTIONS */}
                <div className="layout-card">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 md:p-5">
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

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 md:gap-12">
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
                                        size="sm"
                                        onClick={onAdd}
                                        className="shadow-md shadow-blue-500/10"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SUMMARY CARDS (OPTIONAL) */}
                {stats && stats.length > 0 && (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4 mb-2`}>
                        {stats.map((s, i) => (
                            <div key={i} className="premium-card group relative overflow-hidden flex items-center justify-between min-h-[160px] p-6">
                                <div className="flex flex-col h-full justify-between z-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{s.label}</span>
                                        <h2 className="text-5xl font-semibold text-slate-900 tracking-tight leading-none">{s.value}</h2>
                                    </div>
                                    <div className={`text-[12px] font-semibold ${s.textColor || (s.iconColor?.includes('emerald') ? 'text-emerald-500' : s.iconColor?.includes('rose') ? 'text-rose-500' : s.iconColor?.includes('amber') ? 'text-amber-500' : 'text-blue-500')} flex items-start gap-2 mt-6 max-w-[110px] leading-tight`}>
                                        <span className={`w-2 h-2 rounded-full bg-current opacity-40 mt-1 shrink-0`} />
                                        {s.sub}
                                    </div>
                                </div>
                                <div className={`w-24 h-24 rounded-[2rem] ${s.bg || 'bg-blue-50'} flex items-center justify-center ${s.iconColor || 'text-blue-500'} shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-500`}>
                                    <i className={`pi ${s.icon || 'pi-file'} text-4xl`} />
                                </div>

                                {/* Refined background glow */}
                                <div className={`absolute -right-8 -bottom-8 w-40 h-40 rounded-full ${s.bg || 'bg-blue-50'} opacity-10 blur-3xl transition-opacity duration-500`} />
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. MAIN CONTENT (GRID OR TABLE) */}
                <div className={renderItem ? "" : "layout-card"}>
                    {renderItem ? (
                        <div className={props.gridClassName || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"}>
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="layout-card h-64 animate-pulse bg-slate-50/50" />
                                ))
                            ) : data && data.length > 0 ? (
                                data.map((item, index) => renderItem(item, index))
                            ) : (
                                <div className="col-span-full layout-card">
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
                                </div>
                            )}
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
        </Page>
    );
};

export default ListLayout;
