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

    const filteredData = React.useMemo(() => {
        if (!globalFilter || !data || !Array.isArray(data)) return data;

        const query = globalFilter.toLowerCase().trim();
        if (!query) return data;

        const checkMatch = (val) => {
            if (val === null || val === undefined) return false;
            if (typeof val === 'object') {
                return Object.values(val).some(checkMatch);
            }
            return String(val).toLowerCase().includes(query);
        };

        return data.filter(item => Object.values(item).some(checkMatch));
    }, [data, globalFilter]);

    return (
        <Page title={title}>
            <Tooltip target=".action-tooltip" position="bottom" />
            <div className="flex flex-col gap-4 animate-fade-in pb-4">
                {/* Simplified Header & Actions matching "copy-to-copy" image */}
                <div className="layout-card p-5 md:p-6">
                    <div className="flex flex-col gap-5">
                        {/* Title Row */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                                {title} list
                            </h3>
                            <div></div>
                        </div>

                        {/* Search & Actions Row */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="w-full sm:w-80">
                                <QuickSearchInput
                                    value={globalFilter}
                                    onInput={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Quick Search..."
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {extraActions}
                                {onAdd && (
                                    <button
                                        onClick={onAdd}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wide"
                                    >
                                        {addLabel}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SUMMARY CARDS (OPTIONAL) */}
                {stats && stats.length > 0 && (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4 mb-2`}>
                        {stats.map((s, i) => (
                            <div key={i} className="premium-card group relative overflow-hidden flex items-center justify-between min-h-160px p-6">
                                <div className="flex flex-col h-full justify-between z-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{s.label}</span>
                                        <h2 className="text-5xl font-semibold text-slate-900 tracking-tight leading-none">{s.value}</h2>
                                    </div>
                                    <div className={`text-[12px] font-semibold ${s.textColor || (s.iconColor?.includes('emerald') ? 'text-emerald-500' : s.iconColor?.includes('rose') ? 'text-rose-500' : s.iconColor?.includes('amber') ? 'text-amber-500' : 'text-blue-500')} flex items-start gap-2 mt-6 max-w-110px leading-tight`}>
                                        <span className={`w-2 h-2 rounded-full bg-current opacity-40 mt-1 shrink-0`} />
                                        {s.sub}
                                    </div>
                                </div>
                                <div className={`w-24 h-24 rounded-2rem p-3 md:p-4 ${s.bg || 'bg-blue-50'} flex items-center justify-center ${s.iconColor || 'text-blue-500'} shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-500`}>
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
                            ) : filteredData && filteredData.length > 0 ? (
                                filteredData.map((item, index) => renderItem(item, index))
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
                            value={filteredData}
                            loading={loading}
                            paginator
                            rows={10}
                            className="p-datatable-minimal"
                            responsiveLayout="scroll"
                            showGridlines
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
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
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
