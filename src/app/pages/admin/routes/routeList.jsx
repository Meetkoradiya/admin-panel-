import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import ListLayout from '@/components/shared/ListLayout';
import ActionButtons from '@/components/shared/ActionButtons';
import StatusTag from '@/components/shared/StatusTag';
import useApi from '@/hooks/useApi';
import { showConfirmDialog } from '@/utils/confirmUtils';

const RouteList = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const { apiGet, apiPut, apiDelete } = useApi();

    const fetchRoutes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiGet('/admin/routes');
            const data = response?.data || response || [];
            setRoutes(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch routes' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchRoutes();
    }, [fetchRoutes]);

    const deleteRoute = async (rowData) => {
        showConfirmDialog({
            title: 'Delete Route',
            message: `Delete route "${rowData.routeName || rowData.name}"? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    await apiDelete(`/admin/routes/${rowData.id}`);
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Route Deleted', life: 3000 });
                    fetchRoutes();
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete route' });
                }
            }
        });
    };

    const toggleStatus = async (rowData) => {
        const newStatus = rowData.status === 'Inactive' ? 'Active' : 'Inactive';
        try {
            const id = rowData.id || rowData._id;
            const payload = {
                routeName: rowData.routeName || rowData.name,
                description: rowData.description || "",
                status: newStatus
            };
            await apiPut(`/admin/routes/${id}`, payload);
            toast.current?.show({ severity: 'success', summary: 'Success', detail: `Route set to ${newStatus}` });
            fetchRoutes();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update status' });
        }
    };

    const actionBodyTemplate = (rowData) => (
        <ActionButtons 
            onEdit={() => navigate(`/admin/routes/edit/${rowData.id || rowData._id}`, { state: { route: rowData } })}
            onDelete={() => deleteRoute(rowData)}
        />
    );

    const statusBodyTemplate = (rowData) => {
        return <StatusTag status={rowData.status || 'Active'} />;
    };

    const routeNameTemplate = (rowData) => (
        <div className="flex flex-col gap-1 py-1">
            <span className="text-slate-800 font-extrabold text-[13px] tracking-tight">{rowData.routeName || rowData.name}</span>
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID:</span>
                <span className="text-[10px] font-bold text-slate-400">{rowData.id || rowData._id || 'N/A'}</span>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Route List"
                subtitle="Manage and monitor all delivery routes"
                data={routes}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/admin/routes/add')}
                addLabel="New Route"
            >
                <Column field="no" header="NO." body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '5rem' }} />
                <Column header="ROUTE DETAILS" body={routeNameTemplate} sortField="routeName" />
                <Column field="startPoint" header="START POINT" body={(row) => <span className="text-slate-600 font-bold text-[11px] uppercase tracking-wider">{row.startPoint || '—'}</span>} />
                <Column field="endPoint" header="END POINT" body={(row) => <span className="text-slate-600 font-bold text-[11px] uppercase tracking-wider">{row.endPoint || '—'}</span>} />
                <Column header="STATUS" body={statusBodyTemplate} sortable sortField="status" style={{ width: '10rem', textAlign: 'center' }} />
                <Column header="ACTIONS" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default RouteList;

