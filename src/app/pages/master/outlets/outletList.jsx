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
            // Attempting to fetch from admin/admins as a fallback if specific outlets endpoint is not yet ready
            const data = await apiGet('/admin/admins');
            // Mocking some data if the API returns empty for demonstration in this overhaul phase
            const mockOutlets = Array.isArray(data) ? data.filter(u => u.outletName) : [];
            setOutlets(mockOutlets.length > 0 ? mockOutlets : (Array.isArray(data) ? data : []));
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
            message: `Decommission outlet "${rowData.outletName || rowData.username}"?`,
            header: 'Confirm Decommissioning',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger rounded-xl',
            accept: async () => {
                try {
                    await apiDelete(`/admin/admins/${rowData.id || rowData._id}`);
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
                <i className="pi pi-building text-lg" />
            </div>
            <div className="flex flex-col">
                <p className="font-bold text-slate-800 text-sm">{rowData.outletName || rowData.username || 'Main Branch'}</p>
                <p className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{rowData.address || 'Location pending update'}</p>
            </div>
        </div>
    );

    const statusTemplate = (rowData) => {
        const isActive = rowData.status === 'ACTIVE' || rowData.status === true;
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
            <Button icon="pi pi-external-link" rounded text className="text-blue-500 hover:bg-blue-50 w-10 h-10 rounded-xl" onClick={() => navigate(`/master/outlets/edit/${rowData.id}`)} />
            <Button icon="pi pi-trash" rounded text className="text-rose-500 hover:bg-rose-50 w-10 h-10 rounded-xl" onClick={() => handleDelete(rowData)} />
        </div>
    );

    const header = (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-2">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-indigo-600 rounded-full block"></span>
                    Outlet Directory
                </h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-4">Amrut Water Distribution Nodes</p>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
                <span className="p-input-icon-left flex-1 lg:flex-none relative">
                    <i className="pi pi-search text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search hubs..."
                        className="p-inputtext-sm pl-11 border-slate-200 rounded-xl w-full lg:w-80 bg-slate-50/50 focus:bg-white transition-all outline-none text-sm font-medium"
                    />
                </span>
                <Button
                    label="Deploy New"
                    icon="pi pi-map-marker"
                    className="bg-indigo-600 border-none px-6 py-3 rounded-xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-white whitespace-nowrap text-xs uppercase tracking-widest"
                    onClick={() => navigate('/master/outlets/add')}
                />
            </div>
        </div>
    );

    return (
        <Page title="Outlets">
            <div className="bg-[#f8fafc] min-h-[calc(100vh-5rem)] p-2 md:p-4">
                <Toast ref={toast} />
                <ConfirmDialog />

                <div className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <DataTable
                        value={outlets}
                        header={header}
                        paginator
                        rows={10}
                        loading={loading}
                        globalFilter={globalFilter}
                        responsiveLayout="stack"
                        stripedRows
                        className="p-datatable-sm"
                    >
                        <Column header="Outlet Details" body={outletNameTemplate} sortField="outletName" sortable />
                        <Column field="mobileNumber" header="Contact" className="text-slate-600 font-bold text-sm" />
                        <Column header="Status" body={statusTemplate} style={{ width: '10rem', textAlign: 'center' }} />
                        <Column header="Actions" body={actionTemplate} style={{ width: '8rem', textAlign: 'center' }} />
                    </DataTable>
                </div>
            </div>
        </Page>
    );
};

export default OutletList;
