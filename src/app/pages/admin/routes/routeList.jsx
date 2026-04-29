import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ListLayout from '@/components/shared/ListLayout';
import { showConfirmDialog } from '@/utils/confirmUtils';

const RouteList = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const fetchRoutes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/routes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data || [];
            setRoutes(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch routes' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchRoutes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const deleteRoute = async (rowData) => {
        showConfirmDialog({
            title: 'Delete Route',
            message: `Delete route "${rowData.routeName || rowData.name}"? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    await axios.delete(`${BASE_URL}/admin/routes/${rowData.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Route Deleted', life: 3000 });
                    fetchRoutes();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete route' });
                }
            }
        });
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-pencil"
                rounded text
                tooltip="Edit Route"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-sky-500"
                onClick={() => navigate(`/admin/routes/edit/${rowData.id || rowData._id}`, { state: { route: rowData } })}
            />
            <Button
                icon="pi pi-trash"
                rounded text
                tooltip="Delete Route"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-rose-500"
                onClick={() => deleteRoute(rowData)}
            />
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        const status = rowData.status || 'Active';
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
                {status}
            </span>
        );
    };

    const routeNameTemplate = (rowData) => (
        <div className="flex flex-col gap-1 py-1">
            <span className="text-slate-800 font-black text-sm">{rowData.routeName || rowData.name}</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 w-fit px-2 py-0.5 rounded-md border border-slate-100">
                {rowData.id || rowData._id ? `ID: ${rowData.id || rowData._id}` : 'Draft'}
            </span>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Route Distribution"
                subtitle="Manage and monitor all delivery routes"
                data={routes}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/admin/routes/add')}
                addLabel="New Route"
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column header="Route Details" body={routeNameTemplate} sortable sortField="routeName" />
                <Column field="startPoint" header="Start Point" body={(row) => <span className="text-slate-600 font-bold text-xs uppercase tracking-wider">{row.startPoint || '—'}</span>} sortable />
                <Column field="endPoint" header="End Point" body={(row) => <span className="text-slate-600 font-bold text-xs uppercase tracking-wider">{row.endPoint || '—'}</span>} sortable />
                <Column header="Status" body={statusBodyTemplate} sortable sortField="status" style={{ width: '8rem', textAlign: 'center' }} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default RouteList;