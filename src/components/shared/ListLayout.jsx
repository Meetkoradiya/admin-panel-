import React from 'react';
import { DataTable } from 'primereact/datatable';
import Button from "@/components/ui/Button";
import { Page } from './Page';
import QuickSearchInput from './QuickSearchInput';

const ListLayout = ({
    title,
    subtitle,
    data,
    loading,
    onAdd,
    addLabel = "New Item",
    extraActions,
    globalFilter,
    setGlobalFilter,
    children,
    emptyMessage = "No records found",
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
                        <Button
                            label={addLabel}
                            variant="primary"
                            size="md"
                            onClick={onAdd}
                            className="px-8 shadow-lg shadow-blue-500/20"
                        />
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <Page title={title}>
            <div className="w-full bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden animate-slide-up mt-2">
                <DataTable
                    value={data}
                    header={header}
                    loading={loading}
                    globalFilter={globalFilter}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    className="p-datatable-minimal"
                    responsiveLayout="scroll"
                    emptyMessage={
                        <div className="text-center py-24 flex flex-col items-center justify-center bg-slate-50/20">
                            <img
                                src="/images/no-data.png"
                                alt="No Data"
                                className="w-64 h-auto mb-6 opacity-80"
                                onError={(e) => {
                                    e.target.src = 'https://cdn-icons-png.flaticon.com/512/7486/7486744.png'; // Fallback
                                    e.target.className = "w-32 h-auto mb-6 opacity-20";
                                }}
                            />
                            <div className="text-sm font-semibold uppercase tracking-widest text-slate-400">{emptyMessage}</div>
                            <p className="text-xs text-slate-300 mt-2 font-medium">Try adjusting your filters or adding a new record</p>
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
            </div>
        </Page>
    );
};

export default ListLayout;


