import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ListLayout from '@/components/shared/ListLayout';

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
        if (!window.confirm(`Delete route "${rowData.routeName || rowData.name}"?`)) return;
        try {
            await axios.delete(`${BASE_URL}/admin/routes/${rowData.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Route Deleted', life: 3000 });
            fetchRoutes();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete route' });
        }
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-pencil"
                rounded text
                tooltip="Edit Route"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-sky-500"
                onClick={() => navigate(`/admin/routes/edit/${rowData.id}`, { state: { route: rowData } })}
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

    const routeBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 font-black text-xs border border-violet-100">
                <i className="pi pi-map-marker text-lg" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">{rowData.routeName || rowData.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rowData.id ? `ID: ${rowData.id}` : 'Draft'}</span>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Route Management"
                subtitle="Manage delivery routes and geographic distribution"
                data={routes}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/admin/routes/add')}
                addLabel="New Route"
            >
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column header="Route Details" body={routeBodyTemplate} sortable sortField="routeName" />
                <Column field="description" header="Description" className="text-slate-500 text-sm italic" />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default RouteList;