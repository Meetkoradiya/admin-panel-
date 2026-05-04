import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';
import StatusTag from '@/components/shared/StatusTag';
import ActionButtons from '@/components/shared/ActionButtons';
import { showConfirmDialog } from '@/utils/confirmUtils';

const OutletList = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();
    const { apiGet, apiDelete } = useApi();

    const fetchOutlets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiGet('/master/outlets');
            setOutlets(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch outlets' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => { fetchOutlets(); }, [fetchOutlets]);

    const deleteOutlet = async (rowData) => {
        showConfirmDialog({
            title: 'Delete Outlet',
            message: `Delete outlet "${rowData.name}"? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    await apiDelete(`/master/outlets/${rowData.id}`);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet Removed' });
                    fetchOutlets();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete outlet' });
                }
            }
        });
    };

    const nameBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xs border border-indigo-100">
                {rowData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">{rowData.name}</span>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {rowData.location || 'Default Location'}
                    </span>
                </div>
            </div>
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <ActionButtons 
            onEdit={() => navigate(`/master/outlets/edit/${rowData.id}`, { state: { outlet: rowData } })}
            onDelete={() => deleteOutlet(rowData)}
        />
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Outlet Management"
                subtitle="Manage franchise locations and distribution centers"
                data={outlets}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/master/outlets/add')}
                addLabel="New Outlet"
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-[10px] ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column header="Outlet Details" body={nameBodyTemplate} sortable sortField="name" />
                <Column field="mobileNumber" header="Contact" body={(row) => <span className="text-slate-600 font-bold text-xs tracking-wider">{row.mobileNumber || '—'}</span>} />
                <Column field="status" header="Status" body={(row) => <StatusTag status={row.status || 'ACTIVE'} />} style={{ width: '8rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default OutletList;
