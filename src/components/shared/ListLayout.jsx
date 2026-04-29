import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Page } from './Page';
import QuickSearchInput from './QuickSearchInput';

const ListLayout = ({
    title,
    subtitle,
    data,
    loading,
    onAdd,
    addLabel = "New Item",
    globalFilter,
    setGlobalFilter,
    children,
    emptyMessage = "No records found",
    ...props
}) => {
    const header = (
        <div className="px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
            <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
                {subtitle && <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{subtitle}</p>}
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                <QuickSearchInput
                    value={globalFilter}
                    onInput={(e) => setGlobalFilter(e.target.value)}
                />
                {onAdd && (
                    <Button
                        label={addLabel}
                        icon="pi pi-plus"
                        className="btn-primary btn-responsive"
                        onClick={onAdd}
                    />
                )}
            </div>
        </div>
    );

    return (
        <Page title={title}>
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden animate-slide-up">
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
                            <div className="text-sm font-bold uppercase tracking-widest text-slate-400">{emptyMessage}</div>
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
