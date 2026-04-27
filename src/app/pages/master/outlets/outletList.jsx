import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import useApi from '@/hooks/useApi';
import ListLayout from '@/components/shared/ListLayout';

const OutletList = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();
    const { apiGet, apiDelete } = useApi();

    const fetchOutlets = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/master/outlets');
            setOutlets(Array.isArray(data) ? data : (data?.data || []));
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch outlets' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOutlets(); }, []);

    const deleteOutlet = async (rowData) => {
        if (!window.confirm(`Delete outlet "${rowData.name}"?`)) return;
        try {
            await apiDelete(`/master/outlets/${rowData.id}`);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Outlet Removed' });
            fetchOutlets();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete outlet' });
        }
    };

    const nameBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-xs border border-indigo-100">
                {rowData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">{rowData.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rowData.location || 'No Location'}</span>
            </div>
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button 
                icon="pi pi-pencil" 
                rounded text
                tooltip="Edit Outlet"
                className="btn-icon text-sky-500" 
                onClick={() => navigate(`/master/outlets/edit/${rowData.id}`, { state: { outlet: rowData } })} 
            />
            <Button 
                icon="pi pi-trash" 
                rounded text
                tooltip="Delete Outlet"
                className="btn-icon text-rose-500" 
                onClick={() => deleteOutlet(rowData)}
            />
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Outlet Management"
                subtitle="Manage your franchise locations and distribution centers"
                data={outlets}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/master/outlets/add')}
                addLabel="New Outlet"
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column header="Outlet Details" body={nameBodyTemplate} sortable sortField="name" />
                <Column field="mobileNumber" header="Contact" className="text-slate-500 text-sm font-medium" />
                <Column field="status" header="Status" body={(row) => (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {row.status || 'ACTIVE'}
                    </span>
                )} style={{ width: '8rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default OutletList;
