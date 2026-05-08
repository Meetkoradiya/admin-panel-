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
    
    const toggleStatus = async (rowData) => {
        const currentStatus = rowData.status || 'ACTIVE';
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        
        try {
            const id = rowData.id || rowData.userId || rowData._id;
            const payload = {
                username: rowData.username,
                mobileNumber: rowData.mobileNumber,
                vehicleName: rowData.vehicleName,
                vehicleNumber: rowData.vehicleNumber,
                routeId: rowData.routeId || rowData.route?.id,
                status: newStatus
            };
            
            await apiPut(`/admin/drivers/${id}`, payload);
            
            toast.current?.show({ 
                severity: 'success', 
                summary: 'Status Updated', 
                detail: `Driver status changed to ${newStatus}.`,
                life: 3000 
            });
            fetchDrivers();
        } catch (error) {
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Update Failed', 
                detail: 'Could not change driver status.',
                life: 5000 
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2d',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date).replace(/ /g, ' ').replace(',', ',');
    };

    const driverDetailsTemplate = (rowData) => (
        <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm">{rowData.username || '—'}</span>
            <span className="text-slate-500 text-sm mt-0.5">{rowData.mobileNumber || '—'}</span>
        </div>
    );

    const statusBodyTemplate = (rowData) => {
        const isAssigned = !!(rowData.route || rowData.routeName || rowData.routeId);
        return (
            <span className={classNames(
                "px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider inline-block text-center min-w-[100px] text-white shadow-sm",
                isAssigned ? "bg-[#10B981]" : "bg-[#B91C1C]"
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

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Driver List"
                subtitle="Manage delivery personnel and assignment status"
                data={drivers}
                loading={loading}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onAdd={() => navigate('/admin/drivers/add')}
                addLabel="New Driver"
            >
                <Column field="no" header="No." body={(_, opts) => <span className="text-slate-700 text-sm">{opts.rowIndex + 1}</span>} style={{ width: '4rem' }} />
                <Column header="Driver Details" body={driverDetailsTemplate} sortField="username" />
                <Column header="Status" body={statusBodyTemplate} sortable sortField="routeId" style={{ width: '10rem' }} />
                <Column header="Route name" body={(row) => <span className="text-slate-600 text-sm">{row.route?.routeName || row.routeName || 'Not assigned'}</span>} />
                <Column header="Vehicle details" body={(row) => <span className="text-slate-600 text-sm">{row.vehicleName || '—'}</span>} />
                <Column header="Vehicle No." body={(row) => <span className="text-slate-700 font-bold text-sm">{row.vehicleNumber || '—'}</span>} />
                <Column header="Created at" body={(row) => <span className="text-slate-600 text-sm">{formatDate(row.createdAt || row.updatedAt)}</span>} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DriverList;
