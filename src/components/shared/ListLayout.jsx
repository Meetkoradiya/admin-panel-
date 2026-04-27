import React from 'react';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Page } from './Page';

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
                <div className="relative group flex-grow md:flex-grow-0">
                    <i className="pi pi-search text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm group-focus-within:text-blue-500 transition-colors" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Quick search..."
                        className="pl-11 pr-4 py-3 border-slate-200 rounded-2xl w-full md:w-72 bg-white text-sm font-semibold focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none shadow-sm"
                    />
                </div>
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
                        <div className="text-center py-24 text-slate-400 font-medium bg-slate-50/20">
                            <i className="pi pi-search text-4xl mb-4 opacity-20" />
                            <div className="text-sm font-bold uppercase tracking-widest">{emptyMessage}</div>
                        </div>
                    }
                    dataKey="_id"
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
