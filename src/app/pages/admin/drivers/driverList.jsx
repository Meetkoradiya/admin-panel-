import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import ListLayout from '@/components/shared/ListLayout';
import ActionButtons from '@/components/shared/ActionButtons';
import useApi from '@/hooks/useApi';
import { showConfirmDialog } from '@/utils/confirmUtils';

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

    const driverBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <Avatar
                label={rowData.username?.charAt(0).toUpperCase()}
                className="bg-blue-50 text-blue-500 font-bold"
                style={{ width: '36px', height: '36px', borderRadius: '12px' }}
            />
            <div className="flex flex-col">
                <span className="font-bold text-slate-700 text-sm">{rowData.username}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{rowData.mobileNumber}</span>
            </div>
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <ActionButtons 
            onEdit={() => navigate(`/admin/drivers/edit/${rowData.id || rowData.userId || rowData._id}`, { state: { driver: rowData } })}
            onDelete={() => deleteDriver(rowData)}
            onDeactivate={() => toggleStatus(rowData)}
            isDeactivated={rowData.status === 'INACTIVE'}
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
                <Column field="no" header="#" body={(_, opts) => <span className="text-slate-400 font-bold text-xs">{opts.rowIndex + 1}</span>} style={{ width: '4rem', textAlign: 'center' }} />
                <Column header="Personnel" body={driverBodyTemplate} sortable sortField="username" />
                <Column field="mobileNumber" header="Contact" className="text-slate-500 text-sm font-medium" />
                <Column header="Vehicle" body={(row) => (
                    <div className="flex flex-col">
                        <span className="text-slate-700 font-bold text-xs">{row.vehicleName || '—'}</span>
                        <span className="text-xs text-slate-400 font-bold mt-0.5">{row.vehicleNumber || '—'}</span>
                    </div>
                )} />
                <Column field="route.routeName" header="Assigned Route" body={(row) => <span className="text-blue-500 font-bold text-xs uppercase tracking-wider">{row.route?.routeName || 'Unassigned'}</span>} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DriverList;