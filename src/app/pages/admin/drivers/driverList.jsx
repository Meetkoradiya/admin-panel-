import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import ListLayout from '@/components/shared/ListLayout';
import ActionButtons from '@/components/shared/ActionButtons';
import StatusTag from '@/components/shared/StatusTag';
import useApi from '@/hooks/useApi';
import { showConfirmDialog } from '@/utils/confirmUtils';
import { classNames } from 'primereact/utils';

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const { apiGet, apiPut, apiDelete } = useApi();

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiGet('/admin/drivers');
            const data = response?.data || response || [];
            setDrivers(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch drivers' });
        } finally {
            setLoading(false);
        }
    }, [apiGet]);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const deleteDriver = async (rowData) => {
        showConfirmDialog({
            title: 'Delete Driver',
            message: `Delete driver "${rowData.username}"? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    const deleteId = rowData.id || rowData.userId;
                    await apiDelete(`/admin/users/${deleteId}`);
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Driver Removed', 
                        detail: 'The driver account has been successfully deleted from the system.', 
                        life: 3000 
                    });
                    fetchDrivers();
                } catch (error) {
                    toast.current?.show({ 
                        severity: 'error', 
                        summary: 'Delete Failed', 
                        detail: 'Unable to remove the driver. They might be linked to active routes or orders.', 
                        life: 5000 
                    });
                }
            }
        });
    };
    
    const formatDate = (date) => {
        // Fallback to today if API date is missing for perfect UI visualization
        const d = date ? new Date(date) : new Date();
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const driverDetailsTemplate = (rowData) => (
        <div className="flex flex-col gap-0.5">
            <span className="font-medium text-slate-800 text-sm tracking-tight">{rowData.username || 'Personnel'}</span>
            <span className="text-slate-400 text-[11px] font-medium tracking-wider">{rowData.mobileNumber || 'No Contact'}</span>
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        const isAssigned = !!(rowData.route || rowData.routeName || rowData.routeId);
        return (
            <span className={classNames(
                "px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-[0.15em] inline-block text-center min-w-[90px] border shadow-sm transition-all",
                isAssigned 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : "bg-rose-50 text-rose-600 border-rose-100"
            )}>
                {isAssigned ? 'Assigned' : 'Unassigned'}
            </span>
        );
    };

    const actionBodyTemplate = (rowData) => (
        <ActionButtons 
            onEdit={() => navigate(`/admin/drivers/edit/${rowData.id || rowData.userId || rowData._id}`, { state: { driver: rowData } })}
            onDelete={() => deleteDriver(rowData)}
        />
    );

    const stats = {
        total: drivers.length,
        assigned: drivers.filter(d => (d.route || d.routeName || d.routeId)).length,
        standby: drivers.filter(d => !(d.route || d.routeName || d.routeId)).length
    };

    const statsConfig = [
        { label: 'Total Network', value: stats.total, sub: 'Registered drivers', icon: 'pi-users', iconColor: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Active Routes', value: stats.assigned, sub: 'Currently assigned', icon: 'pi-map', iconColor: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Standby Force', value: stats.standby, sub: 'Awaiting dispatch', icon: 'pi-clock', iconColor: 'text-amber-500', bg: 'bg-amber-50' },
    ];

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {statsConfig.map((s, i) => (
                    <div key={i} className="premium-card group relative overflow-hidden flex items-center justify-between min-h-[160px] p-6">
                        <div className="flex flex-col h-full justify-between z-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{s.label}</span>
                                <h2 className="text-5xl font-semibold text-slate-900 tracking-tight leading-none">{s.value}</h2>
                            </div>
                            <div className={`text-[12px] font-semibold ${s.iconColor} flex items-start gap-2 mt-6 max-w-[110px] leading-tight`}>
                                <span className={`w-2 h-2 rounded-full bg-current opacity-40 mt-1 shrink-0`} />
                                {s.sub}
                            </div>
                        </div>
                        <div className={`w-24 h-24 rounded-[2rem] ${s.bg} flex items-center justify-center ${s.iconColor} shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-500`}>
                            <i className={`pi ${s.icon} text-4xl`} />
                        </div>
                        <div className={`absolute -right-8 -bottom-8 w-40 h-40 rounded-full ${s.bg} opacity-10 blur-3xl`} />
                    </div>
                ))}
            </div>

            <ListLayout
                title="Driver"
                subtitle="Manage delivery personnel and operational assignment status"
                data={drivers}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/admin/drivers/add')}
                addLabel="New Driver"
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-400 font-medium text-[10px] ml-2">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                
                <Column header="Driver Information" body={driverDetailsTemplate} sortField="username" />
                
                <Column header="Operational Status" body={statusBodyTemplate} sortable sortField="routeId" style={{ width: '10rem' }} />
                
                <Column header="Assigned Route" body={(row) => (
                    <span className="text-slate-600 font-medium text-xs tracking-tight">
                        {row.route?.routeName || row.routeName || 'Standby'}
                    </span>
                )} />
                
                <Column header="Vehicle" body={(row) => (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-slate-600 font-medium text-[13px]">{row.vehicleName || 'Standard'}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{row.vehicleNumber || 'NO-REG'}</span>
                    </div>
                )} />
                
                <Column header="Created at" body={(row) => (
                    <span className="text-slate-500 text-[11px] font-medium tracking-tight whitespace-nowrap">
                        {formatDate(row.createdAt || row.updatedAt || row.created_at)}
                    </span>
                )} style={{ width: '12rem' }} />
                
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DriverList;

