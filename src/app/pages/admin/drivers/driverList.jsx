import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ListLayout from '@/components/shared/ListLayout';
import { showConfirmDialog } from '@/utils/confirmUtils';

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef(null);
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/admin/drivers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || response.data || [];
            setDrivers(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch drivers' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchDrivers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const deleteDriver = async (rowData) => {
        showConfirmDialog({
            title: 'Delete Driver',
            message: `Delete driver "${rowData.username}"? This action cannot be undone.`,
            type: 'delete',
            acceptLabel: 'Delete',
            onAccept: async () => {
                try {
                    const deleteId = rowData.id || rowData.userId;
                    await axios.delete(`${BASE_URL}/admin/users/${deleteId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
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

    const driverBodyTemplate = (rowData) => (
        <div className="flex items-center gap-3">
            <Avatar
                label={rowData.username?.charAt(0).toUpperCase()}
                className="bg-blue-50 text-blue-500 font-bold"
                style={{ width: '36px', height: '36px', borderRadius: '12px' }}
            />
            <div className="flex flex-col">
                <span className="font-bold text-slate-700 text-sm">{rowData.username}</span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{rowData.mobileNumber}</span>
            </div>
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-pencil"
                rounded text
                tooltip="Edit Driver"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-sky-500"
                onClick={() => navigate(`/admin/drivers/edit/${rowData.id || rowData.userId || rowData._id}`, { state: { driver: rowData } })}
            />
            <Button
                icon="pi pi-trash"
                rounded text
                tooltip="Delete Driver"
                tooltipOptions={{ position: 'top' }}
                className="btn-icon text-rose-500"
                onClick={() => deleteDriver(rowData)}
            />
        </div>
    );

    return (
        <div className="animate-fade-in">
            <Toast ref={toast} />
            <ListLayout
                title="Logistics Team"
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
                        <span className="text-[10px] text-slate-400 font-bold">{row.vehicleNumber || '—'}</span>
                    </div>
                )} />
                <Column field="route.routeName" header="Assigned Route" body={(row) => <span className="text-blue-500 font-bold text-xs uppercase tracking-wider">{row.route?.routeName || 'Unassigned'}</span>} />
                <Column header="Actions" body={actionBodyTemplate} style={{ width: '10rem', textAlign: 'center' }} />
            </ListLayout>
        </div>
    );
};

export default DriverList;