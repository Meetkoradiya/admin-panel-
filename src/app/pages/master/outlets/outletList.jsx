import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { Page } from "@/components/shared/Page";
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
const OutletList = () => {
    const [outlets, setOutlets] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();
    const { apiGet, apiDelete } = useApi();

    const fetchOutlets = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/master/outlets');
            setOutlets(Array.isArray(data) ? data : (data?.data ? data.data : []));
        } catch (error) {
            console.error('Fetch Outlets Error:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch outlet locations' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOutlets(); }, []);

    const handleDelete = (rowData) => {
        confirmDialog({
            message: `Decommission outlet "${rowData.name}"?`,
            header: 'Confirm Decommissioning',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger rounded-xl',
            accept: async () => {
                try {
                    await apiDelete(`/master/outlets/${rowData.id}`);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet decommissioned' });
                    fetchOutlets();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Decommissioning failed' });
                }
            }
        });
    };

    const outletNameTemplate = (rowData) => (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
                <i className="pi pi-building text-lg" />
            </div>
            <div className="flex flex-col">
                <p className="font-bold text-slate-800 text-sm">{rowData.name || 'Unnamed Outlet'}</p>
                <p className="text-xs text-slate-400 font-medium truncate max-w-200px">{rowData.address || 'Address not set'}</p>
            </div>
        </div>
    );

    const statusTemplate = (rowData) => {
        const isActive = rowData.isActive === true;
        return (
            <Tag 
                value={isActive ? 'OPERATIONAL' : 'OFFLINE'} 
                className={isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} 
                style={{ borderRadius: '10px', fontSize: '10px', fontWeight: '900', padding: '5px 12px', border: '1px solid' }}
            />
        );
    };

    const actionTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button icon="pi pi-external-link" rounded text className="text-blue-500 hover:bg-blue-50 w-10 h-10 rounded-xl" onClick={() => navigate(`/master/outlets/edit/${rowData.id}`, { state: { outlet: rowData } })} />
            <Button icon="pi pi-trash" rounded text className="text-rose-500 hover:bg-rose-50 w-10 h-10 rounded-xl" onClick={() => handleDelete(rowData)} />
        </div>
    );


    return (
        <Page title="Outlet list">
            <div className="bg-[#f4f7fa] min-h-[calc(100vh-4rem)] p-4 md:p-6">
                <Toast ref={toast} />
                <ConfirmDialog />

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-slate-800">Outlet list</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <i className="pi pi-search text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 text-sm" />
                                <InputText
                                    type="search"
                                    onInput={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Quick Search..."
                                    className="pl-11 pr-4 py-2.5 border-slate-200 rounded-xl w-full md:w-80 bg-white text-sm font-medium focus:border-blue-400 focus:ring-0 transition-all outline-none"
                                />
                            </div>
                            <Button
                                label="New Outlet"
                                className="bg-[#3b82f6] border-none px-6 py-2.5 rounded-xl font-bold text-white shadow-sm hover:bg-blue-600 transition-all text-sm"
                                onClick={() => navigate('/master/outlets/add')}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <DataTable
                        value={outlets}
                        paginator
                        rows={10}
                        loading={loading}
                        globalFilter={globalFilter}
                        className="p-datatable-minimal"
                        responsiveLayout="scroll"
                        emptyMessage={
                            <div className="text-center py-20 text-slate-400 font-medium">
                                No outlet locations found
                            </div>
                        }
                        dataKey="id"
                        rowHover
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        rowsPerPageOptions={[10, 20, 50]}
                    >
                        <Column field="no" header="No." body={(_, opts) => <span className="text-slate-600 font-medium text-sm ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                        <Column header="Outlet Name" body={outletNameTemplate} sortField="name" sortable headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column field="address" header="Address" className="text-slate-600 font-medium text-sm" headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Status" body={statusTemplate} sortField="isActive" sortable style={{ textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                        <Column header="Actions" body={actionTemplate} style={{ width: '8rem', textAlign: 'center' }} headerClassName="text-slate-500 font-bold text-xs uppercase tracking-wider bg-slate-50/50 py-4" />
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default OutletList;
